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

    const baseUrls = this.getBaseUrls({ port, unsecureHttp });
    const resources = this.getResources(resource);
    const directories = this.getResources(directory);
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
    const queries = this.getQueries(query);

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
   * Creates a URL with a protocol
   */
  private getUrlWithProtocol(url: string, unsecureHttp = false): string {
    const protocol = `http${unsecureHttp ? '' : 's'}://`;
    const hasProtocol = patterns.protocol.test(url);
    return hasProtocol ? url : `${protocol}${removeProtocol(url)}`;
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
  private getQueries(query: string | string[] | QueryGetterFn<S> | undefined) {
    // set current search's queries to the provided option
    if (typeof query === 'string') {
      return [query];
    }

    if (
      Array.isArray(query) &&
      query.every((q): q is string => typeof q === 'string')
    ) {
      return query;
    }

    const { search: configSearch } = this.config ?? {};
    if (query != null && query instanceof Function && configSearch != null) {
      const result = returnTypeGuard(query, configSearch);
      if (result != null) {
        return Array.isArray(result) ? result : [result];
      }
    }

    // fallback the engine's query to its root (base url)
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
   * - If resource is not provided, returns an empty array
   */
  private getResources(
    resource: string | string[] | ResourceGetterFn<R> | undefined,
  ): string[] {
    if (typeof resource === 'string') {
      return [resource];
    }

    if (
      Array.isArray(resource) &&
      resource.every((r): r is string => typeof r === 'string')
    ) {
      return resource;
    }

    if (
      resource != null &&
      resource instanceof Function &&
      this.config?.resources != null
    ) {
      const result = returnTypeGuard(resource, this.config.resources);
      if (result != null) {
        return Array.isArray(result) ? result : [result];
      }
    }

    return [];
  }

  private getUniquePorts(ports: number | number[]): number[] {
    return [...new Set(Array.isArray(ports) ? ports : [ports])];
  }

  private getHref(url: string): string {
    return new URL(url).href;
  }
}
