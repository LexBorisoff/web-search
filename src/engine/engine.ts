import { patterns } from '../utils/patterns.js';
import { removeLeadingSlash } from '../utils/remove-leading-slash.js';
import { addTrailingSlash } from '../utils/add-trailing-slash.js';
import { removeProtocol } from '../utils/remove-protocol.js';
import { returnTypeGuard } from '../utils/return-type-guard.js';
import type {
  EngineConfig,
  SearchConfig,
  ResourceConfig,
  SearchMethodOptions,
  NavigateMethodOptions,
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

    return this.getUniquePorts(portValue)
      .map((port) => this.getUrlWithPort(this.baseUrl, port))
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
    const { directory, port } = options;

    if (typeof resource === 'string') {
      return;
    }

    if (Array.isArray(resource)) {
      return;
    }

    if (resource != null && this.config?.resources != null) {
      const result = returnTypeGuard(resource, this.config.resources);
      return;
    }
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
    const { query: queryValue, port, unsecureHttp } = options;

    function buildUrls(baseUrl: string, queries: string[]): string[] {
      return queries.map(
        (query) => `${addTrailingSlash(baseUrl)}${removeLeadingSlash(query)}`,
      );
    }

    // fallback the engine's query to its root (base url)
    let defaultQuery = '';

    // set the default query to the engine config's main value, if it exists
    const { search } = this.config ?? {};
    if (search != null) {
      if (typeof search === 'string') {
        defaultQuery = search;
      } else if (search instanceof Object && 'main' in search) {
        defaultQuery = search.main;
      }
    }

    let queries = [defaultQuery];

    // set current search's queries to the provided option
    if (typeof queryValue === 'string') {
      queries = [queryValue];
    } else if (
      Array.isArray(queryValue) &&
      queryValue.every((query): query is string => typeof query === 'string')
    ) {
      queries = queryValue;
    } else if (
      queryValue != null &&
      queryValue instanceof Function &&
      search != null
    ) {
      const query = returnTypeGuard(queryValue, search);
      if (query != null) {
        queries = Array.isArray(query) ? query : [query];
      }
    }

    return this.getBaseUrls({ port, unsecureHttp }).reduce<string[]>(
      (result, baseUrl) => [...result, ...buildUrls(baseUrl, queries)],
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
   *
   * TODO: implement
   */
  private getUrlWithPort(url: string, port: number): string {
    return url;
  }

  private getUniquePorts(ports: number | number[]): number[] {
    return [...new Set(Array.isArray(ports) ? ports : [ports])];
  }

  private getHref(url: string): string {
    return new URL(url).href;
  }
}
