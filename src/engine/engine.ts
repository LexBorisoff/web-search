import { patterns } from '../utils/patterns.js';
import { removeLeadingSlash } from '../utils/remove-leading-slash.js';
import { removeProtocol } from '../utils/remove-protocol.js';
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
  public getBaseUrls({
    port: portValue,
    unsecureHttp,
  }: Pick<SearchMethodOptions<S>, 'port' | 'unsecureHttp'> = {}) {
    if (portValue == null) {
      return [this.getUrlWithProtocol(this.baseUrl, unsecureHttp)];
    }

    const ports = this.getUniquePorts(portValue);
    const baseUrlsWithPorts = ports.map((port) =>
      this.getBaseUrlWithPort(this.baseUrl, port),
    );

    return baseUrlsWithPorts.map((baseUrl) =>
      this.getUrlWithProtocol(baseUrl, unsecureHttp),
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
    { query, port, split, unsecureHttp }: SearchMethodOptions<S> = {},
  ): string[] {
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
    { directory, ...config }: NavigateMethodOptions<R> = {},
  ) {
    if (typeof resource === 'string') {
      return;
    }

    if (Array.isArray(resource)) {
      return;
    }

    if (resource != null && this.config?.resources != null) {
      const result = resource(this.config.resources);
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
    {
      query,
      port,
      split,
      unsecureHttp,
    }: Pick<
      SearchMethodOptions<S>,
      'query' | 'port' | 'split' | 'unsecureHttp'
    >,
  ): string[] {
    const queryUrls = this.getQueryUrls({
      query,
      port,
      unsecureHttp,
    });

    if (split) {
      const keywords = this.getKeywords(searchValue);
      //
    }

    return [];
  }

  /**
   * Creates URLs by adding the `query` property to the engine's
   * base URL that can be used to query search keywords.
   *
   * For example `https://google.com/search?q=`
   */
  private getQueryUrls({
    query,
    port,
    unsecureHttp,
  }: Pick<SearchMethodOptions<S>, 'query' | 'port' | 'unsecureHttp'>) {
    function buildUrls(baseUrl: string, queries: string[]): string[] {
      return queries.map(
        (engineQuery) => `${baseUrl}/${removeLeadingSlash(engineQuery)}`,
      );
    }

    let queries: string[] = [];
    if (typeof query === 'string') {
      queries = [query];
    } else if (Array.isArray(query)) {
      queries = query;
    } else if (query != null && this.config?.search != null) {
      const result = query(this.config.search);
      queries = Array.isArray(result) ? result : [result];
    }

    const baseUrls = this.getBaseUrls({ port, unsecureHttp });
    return baseUrls.reduce<string[]>(
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
    const hasProtocol = patterns.protocol.test(url);
    const protocol = `http${unsecureHttp ? '' : 's'}://`;
    const fullUrl = `${protocol}${removeProtocol(url)}`;
    return new URL(hasProtocol ? url : fullUrl).href;
  }

  // TODO: implement
  private getBaseUrlWithPort(baseUrl: string, port: number): string {
    return '';
  }

  private getUniquePorts(ports: number | number[]): number[] {
    return [...new Set(Array.isArray(ports) ? ports : [ports])];
  }
}
