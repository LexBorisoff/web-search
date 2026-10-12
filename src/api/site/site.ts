import { matchers } from '../matchers/matchers.js';
import { extractProtocol } from '../utils/extract-protocol.js';
import { removeProtocol } from '../utils/remove-protocol.js';
import { returnTypeGuard } from '../utils/return-type-guard.js';
import { slash } from '../utils/slash.js';

import type {
  SiteConfig,
  QueryPathConfig,
  ResourceConfig,
  QueryMethodOptions,
  ResourceMethodOptions,
  QueryPathGetterFn,
  ResourceGetterFn,
} from './site.types.js';

export class Site<
  S extends QueryPathConfig = undefined,
  R extends ResourceConfig = undefined,
> {
  #baseUrl: string;

  #config: SiteConfig<S, R>;

  #delimiter: string = ' ';

  constructor(baseUrl: string, config: SiteConfig<S, R> = {}) {
    this.#baseUrl = baseUrl;
    this.#config = config;

    if (config.delimiter != null) {
      this.#delimiter = config.delimiter;
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /*                 PUBLIC API               */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Creates base URLs with a protocol and a port, if provided
   */
  public getBaseUrls(
    options: Pick<QueryMethodOptions<S>, 'port' | 'unsecureHttp'> = {},
  ): string[] {
    const { port: portValue, unsecureHttp } = options;
    const emptyPortsArray = Array.isArray(portValue) && portValue.length === 0;

    if (portValue == null || emptyPortsArray) {
      const baseUrl = this.getUrlWithProtocol(this.#baseUrl, unsecureHttp);
      return [this.getHref(baseUrl)];
    }

    const ports = this.getUniquePorts(portValue);

    return (
      ports
        // add ports
        .reduce<string[]>(
          (result, port) => [
            ...result,
            ...this.getUrlWithPort(this.#baseUrl, port).filter(
              (url) => !result.includes(url),
            ),
          ],
          [],
        )
        // add protocol
        .map((url) => this.getUrlWithProtocol(url, unsecureHttp))
        .map((url) => this.getHref(url))
    );
  }

  /**
   * Creates search URLs.
   *
   * - If search value is not provided or is empty,
   * then URLs are created by using the base URL
   */
  public search(
    searchValue?: string | null,
    options: QueryMethodOptions<S> = {},
  ): string[] {
    const { queryPath, port, split, unsecureHttp } = options;

    return searchValue == null || searchValue.trim() === ''
      ? this.getBaseUrls({ port, unsecureHttp })
      : this.getSearchUrls(searchValue, {
          queryPath,
          port,
          split,
          unsecureHttp,
        });
  }

  /**
   * Creates URLs for the provided resource
   */
  public resource(
    resourceValue: string | string[] | ResourceGetterFn<R>,
    options: ResourceMethodOptions<R> = {},
  ): string[] {
    const { path: pathValue, port, unsecureHttp } = options;

    const baseUrls = this.getBaseUrls({ port, unsecureHttp });
    const resources = this.getResourceValues(resourceValue);
    const paths = this.getResourceValues(pathValue);

    const resourceUrls = baseUrls.reduce<string[]>(
      (result, baseUrl) => [
        ...result,
        ...resources
          .map(
            (resource) =>
              slash.trailing.add(baseUrl) + slash.leading.remove(resource),
          )
          .filter((url) => !result.includes(url)),
      ],
      [],
    );

    if (paths.length > 0) {
      return resourceUrls.reduce<string[]>(
        (result, url) => [
          ...result,
          ...paths.map(
            (path) =>
              (path.startsWith('?') ? url : slash.trailing.add(url)) +
              slash.leading.remove(path),
          ),
        ],
        [],
      );
    }

    return resourceUrls;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /*              PRIVATE METHODS             */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Creates final URLs with search keywords
   */
  private getSearchUrls(
    searchValue: string,
    options: Pick<
      QueryMethodOptions<S>,
      'queryPath' | 'port' | 'split' | 'unsecureHttp'
    >,
  ): string[] {
    const { queryPath, port, split, unsecureHttp } = options;

    const keywords = this.getKeywords(searchValue);
    const urls = this.getSearchPathUrls({
      queryPath,
      port,
      unsecureHttp,
    });

    if (split) {
      return keywords.reduce<string[]>(
        (result, keyword) => [
          ...result,
          ...urls.map((url) => this.getHref(url + keyword)),
        ],
        [],
      );
    }

    return urls.map((url) =>
      this.getHref(url + keywords.join(this.#delimiter)),
    );
  }

  /**
   * Creates URLs by adding the `queryPath` property to the site's
   * base URL that can be used to query search keywords.
   *
   * For example `https://google.com/search?q=`
   */
  private getSearchPathUrls(
    options: Pick<QueryMethodOptions<S>, 'queryPath' | 'port' | 'unsecureHttp'>,
  ): string[] {
    const { queryPath, port, unsecureHttp } = options;
    const baseUrls = this.getBaseUrls({ port, unsecureHttp });
    const searchPaths = this.getSearchPathValues(queryPath);

    return baseUrls.reduce<string[]>(
      (result, baseUrl) => [
        ...result,
        ...searchPaths.map(
          (sp) =>
            (baseUrl.endsWith('=') ? baseUrl : slash.trailing.add(baseUrl)) +
            (sp.startsWith('?') ? sp : slash.leading.remove(sp)),
        ),
      ],
      [],
    );
  }

  /**
   * Splits the search value into an array of keyword strings
   */
  private getKeywords(searchValue: string): string[] {
    return searchValue
      .trim()
      .split(' ')
      .filter((keyword) => keyword.length > 0);
  }

  /**
   * Creates a URL with a protocol.
   *
   * @param unsecureHttp
   * If provided and URL string includes a protocol,
   * the URL's protocol will be overridden
   */
  private getUrlWithProtocol(url: string, unsecureHttp?: boolean): string {
    const protocol = `http${unsecureHttp ? '' : 's'}://`;
    const hasProtocol = matchers.protocol.test(url);
    return hasProtocol && unsecureHttp == null
      ? url
      : `${protocol}${removeProtocol(url)}`;
  }

  /**
   * Creates a URL with a port
   */
  private getUrlWithPort(url: string, port: number): string[] {
    const protocol = extractProtocol(url) ?? '';
    const noProtocolUrl = removeProtocol(url);

    function hasPort(): boolean {
      return matchers.port.test(url);
    }

    function buildUrl(): string {
      const matches = noProtocolUrl.match(matchers.port);

      // provided URL includes a port
      if (matches != null) {
        const [, currentPort] = matches;
        const colon = ':';
        const i = noProtocolUrl.indexOf(colon);

        // provided port is not part of the url
        if (currentPort !== port.toString() && i >= 0) {
          const beforePort = noProtocolUrl.substring(0, i);
          const afterPort = noProtocolUrl.substring(
            i + colon.length + currentPort.length,
          );

          return `${protocol}${beforePort}:${port}${afterPort}`;
        }

        // provided port is already part of the url
        return url;
      }

      // provided URL does not include a port
      const i = noProtocolUrl.indexOf('/');
      const host = i > 0 ? noProtocolUrl.substring(0, i) : noProtocolUrl;
      const path = i > 0 ? noProtocolUrl.substring(i) : '';

      return `${protocol}${host}:${port}${path}`;
    }

    const urlWithPort = buildUrl();
    return hasPort() && urlWithPort !== url
      ? [url, urlWithPort]
      : [urlWithPort];
  }

  /**
   * Returns an array of `queryPath` values provided for the current `search` call
   *
   * - If `queryPath` is not provided or is invalid, defaults to the site's
   * main `search` value
   *
   * - If site does not have a main `search` value, default to the
   * site's root (effectively querying the base url)
   */
  private getSearchPathValues(
    queryPath: string | string[] | QueryPathGetterFn<S> | undefined,
  ): string[] {
    if (typeof queryPath === 'string') {
      return [queryPath];
    }

    if (
      Array.isArray(queryPath) &&
      queryPath.every((sp): sp is string => typeof sp === 'string')
    ) {
      return queryPath;
    }

    const { query: configQuery } = this.#config;
    if (queryPath != null && queryPath instanceof Function) {
      const result = returnTypeGuard(queryPath, configQuery);
      if (result != null) {
        return Array.isArray(result) ? result : [result];
      }
    }

    // fallback to the site's root (base url)
    let defaultSearchPath = '/';

    // set the default to the site config's main value, if it exists
    if (configQuery != null) {
      if (typeof configQuery === 'string') {
        defaultSearchPath = configQuery;
      } else if (configQuery instanceof Object && 'main' in configQuery) {
        defaultSearchPath = configQuery.main;
      }
    }

    return [defaultSearchPath];
  }

  /**
   * Returns an array of resources for the current `resource` call.
   *
   * - If resource is not provided or is invalid, returns an empty array
   */
  private getResourceValues(
    resourceValue: string | string[] | ResourceGetterFn<R> | undefined,
  ): string[] {
    if (typeof resourceValue === 'string') {
      return [resourceValue];
    }

    if (
      Array.isArray(resourceValue) &&
      resourceValue.every((r): r is string => typeof r === 'string')
    ) {
      return resourceValue;
    }

    if (resourceValue != null && resourceValue instanceof Function) {
      const result = returnTypeGuard(resourceValue, this.#config.resources);
      if (result != null) {
        return Array.isArray(result) ? result : [result];
      }
    }

    return [];
  }

  /**
   * Returns an array of unique port numbers
   */
  private getUniquePorts(ports: number | number[]): number[] {
    return [...new Set(Array.isArray(ports) ? ports : [ports])];
  }

  /**
   * Returns a property formatted URL string
   */
  private getHref(url: string): string {
    return new URL(url).href;
  }
}
