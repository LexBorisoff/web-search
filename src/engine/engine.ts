import { patterns } from '../utils/patterns.js';
import { removeLeadingSlash } from '../utils/remove-leading-slash.js';
import { addTrailingSlash } from '../utils/add-trailing-slash.js';
import { removeProtocol } from '../utils/remove-protocol.js';
import { returnTypeGuard } from '../utils/return-type-guard.js';
import { extractProtocol } from '../utils/extract-protocol.js';
import type {
  EngineConfig,
  SearchConfig,
  ResourceConfig,
  SearchMethodOptions,
  NavigateMethodOptions,
  QueryGetterFn,
  ResourceGetterFn,
} from './engine.types.js';

export class Engine<
  S extends SearchConfig = undefined,
  R extends ResourceConfig = undefined,
> {
  private _delimiter: string = ' ';

  constructor(
    private readonly baseUrl: string,
    private readonly config?: EngineConfig<S, R>,
  ) {
    if (config?.delimiter != null) {
      this._delimiter = config.delimiter;
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /*                 PUBLIC API               */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Creates base URLs with a protocol and a port, if provided
   */
  public getBaseUrls(
    options: Pick<SearchMethodOptions<S>, 'port' | 'unsecureHttp'> = {},
  ) {
    const { port: portValue, unsecureHttp } = options;

    if (portValue == null) {
      return [
        this.getHref(this.getUrlWithProtocol(this.baseUrl, unsecureHttp)),
      ];
    }

    const urlsWithPort = this.getUniquePorts(portValue).reduce<string[]>(
      (result, port) => [
        ...result,
        ...this.getUrlWithPort(this.baseUrl, port).filter(
          (url) => !result.includes(url),
        ),
      ],
      [],
    );

    return urlsWithPort
      .map((url) => this.getUrlWithProtocol(url, unsecureHttp))
      .map((url) => this.getHref(url));
  }

  /**
   * Creates search URLs.
   *
   * - If search value is not provided or is empty,
   * then URLs are created by using the base URL
   */
  public search(
    searchValue?: string | null,
    options: SearchMethodOptions<S> = {},
  ): string[] {
    const { query, port, split, unsecureHttp } = options;

    return searchValue == null || searchValue.trim() === ''
      ? this.getBaseUrls({ port, unsecureHttp })
      : this.getSearchUrls(searchValue, {
          query,
          port,
          split,
          unsecureHttp,
        });
  }

  /**
   * Creates URLs for the provided resource
   */
  public navigate(
    resource: string | string[] | ResourceGetterFn<R>,
    options: NavigateMethodOptions<R> = {},
  ) {
    const { directory, port, unsecureHttp } = options;

    const resources = this.getResourceValues(resource);
    const directories = this.getResourceValues(directory);

    const navigateUrls = this.getBaseUrls({ port, unsecureHttp }).reduce<
      string[]
    >(
      (result, baseUrl) => [
        ...result,
        ...resources
          .map((r) => `${addTrailingSlash(baseUrl)}${removeLeadingSlash(r)}`)
          .filter((url) => !result.includes(url)),
      ],
      [],
    );

    if (directories.length > 0) {
      return navigateUrls.reduce<string[]>(
        (result, url) => [
          ...result,
          ...directories.map(
            (d) => `${addTrailingSlash(url)}${removeLeadingSlash(d)}`,
          ),
        ],
        [],
      );
    }

    return navigateUrls;
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
      SearchMethodOptions<S>,
      'query' | 'port' | 'split' | 'unsecureHttp'
    >,
  ): string[] {
    const { query, port, split, unsecureHttp } = options;

    const keywords = this.getKeywords(searchValue);
    const queryUrls = this.getQueryUrls({
      query,
      port,
      unsecureHttp,
    });

    if (split) {
      return keywords.reduce<string[]>(
        (result, keyword) => [
          ...result,
          ...queryUrls.map((queryUrl) => this.getHref(queryUrl + keyword)),
        ],
        [],
      );
    }

    return queryUrls.map((queryUrl) =>
      this.getHref(queryUrl + keywords.join(this._delimiter)),
    );
  }

  /**
   * Creates URLs by adding the `query` property to the engine's
   * base URL that can be used to query search keywords.
   *
   * For example `https://google.com/search?q=`
   */
  private getQueryUrls(
    options: Pick<SearchMethodOptions<S>, 'query' | 'port' | 'unsecureHttp'>,
  ) {
    const { query, port, unsecureHttp } = options;
    const queries = this.getQueryValues(query);

    return this.getBaseUrls({ port, unsecureHttp }).reduce<string[]>(
      (result, baseUrl) => [
        ...result,
        ...queries.map(
          (q) => `${addTrailingSlash(baseUrl)}${removeLeadingSlash(q)}`,
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
    const hasProtocol = patterns.protocol.test(url);
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

    function hasPort() {
      return patterns.port.test(url);
    }

    function buildUrl() {
      const matches = noProtocolUrl.match(patterns.port);

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
   * Returns an array of `query` values provided for the current `search` call
   *
   * - If `query` is not provided or is invalid, defaults to the engine's
   * main `search` value
   *
   * - If the engine does not have a main `search` value, default to the
   * engine's root (effectively querying the base url)
   */
  private getQueryValues(
    queryValue: string | string[] | QueryGetterFn<S> | undefined,
  ) {
    if (typeof queryValue === 'string') {
      return [queryValue];
    }

    if (
      Array.isArray(queryValue) &&
      queryValue.every((query): query is string => typeof query === 'string')
    ) {
      return queryValue;
    }

    const { search: configSearch } = this.config ?? {};
    if (
      queryValue != null &&
      queryValue instanceof Function &&
      configSearch != null
    ) {
      const result = returnTypeGuard(queryValue, configSearch);
      if (result != null) {
        return Array.isArray(result) ? result : [result];
      }
    }

    // fallback query to the engine's root (base url)
    let defaultQuery = '/';

    // set the default query to the engine config's main value, if it exists
    if (configSearch != null) {
      if (typeof configSearch === 'string') {
        defaultQuery = configSearch;
      } else if (configSearch instanceof Object && 'main' in configSearch) {
        defaultQuery = configSearch.main;
      }
    }

    return [defaultQuery];
  }

  /**
   * Returns an array of resources for the current `navigate` call.
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

    if (
      resourceValue != null &&
      resourceValue instanceof Function &&
      this.config?.resources != null
    ) {
      const result = returnTypeGuard(resourceValue, this.config.resources);
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
