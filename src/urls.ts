import { OptionsStore, type SearchOptions } from './options-store.js';
import { Engine } from './engine.js';
import { slash } from './utils/slash.js';
import { removeProtocol } from './utils/remove-protocol.js';
import { extractProtocol } from './utils/extract-protocol.js';
import { patterns } from './utils/patterns.js';

type EngineType = Engine | string;

const defaultEngine = new Engine('google.com', {
  query: 'search?q=',
});

export class Urls extends OptionsStore {
  /**
   * A list of constructed URLs
   */
  public readonly urls: string[];

  constructor(options: SearchOptions = {}) {
    super(options);
    this.urls = this.getUrls();
  }

  private get urlKeywords(): string[] {
    return this.keywords.filter((keyword) => patterns.url.test(keyword));
  }

  private get nonUrlKeywords(): string[] {
    return this.keywords.filter((keyword) => !patterns.url.test(keyword));
  }

  private get withKeywords(): boolean {
    return this.keywords.some((keyword) => !patterns.url.test(keyword));
  }

  private get withUrlsOnly(): boolean {
    return (
      this.keywords.length > 0 &&
      this.keywords.every((keyword) => patterns.url.test(keyword))
    );
  }

  /**
   * Returns a list of constructed URLs
   */
  private getUrls(): string[] {
    let engineList: EngineType[] = [];
    if (this.engine != null) {
      engineList = Array.isArray(this.engine) ? this.engine : [this.engine];
    }

    if (this.engine == null && !this.withKeywords && !this.withUrlsOnly) {
      return this.handleProtocol();
    }

    return this.handleProtocol(
      engineList.length === 0
        ? this.constructUrls()
        : engineList.reduce<string[]>(
            (result, engine) => [...result, ...this.constructUrls(engine)],
            [],
          ),
    );
  }

  /**
   * Returns a list of constructed URLs based on the engine or the URL argument(s)
   *
   * @param engine
   * if not provided, the default engine is used
   */
  private constructUrls(engineOption?: EngineType | null): string[] {
    const engine = engineOption ?? this.defaultEngine ?? defaultEngine;

    // route
    if (this.route != null) {
      // query routes of the provided URLs
      if (this.withUrlsOnly) {
        const urls = this.urlKeywords.reduce<string[]>(
          (result, url) => [...result, ...this.getUrlRouteQueries(url, true)],
          [],
        );

        return urls.reduce<string[]>(
          (result, url) => [...result, ...this.handlePort(url)],
          [],
        );
      }

      // query engine routes
      if (this.keywords.length > 0) {
        return this.keywords.reduce<string[]>(
          (result, keyword) => [
            ...result,
            ...this.getEngineRouteQueries(engine, keyword),
          ],
          [],
        );
      }

      // access engine routes
      return this.getEngineRouteQueries(engine);
    }

    // URL
    if (this.withUrlsOnly) {
      // search engine query with URLs as part of the search query
      if (engineOption != null) {
        return this.getSearchQueries(engineOption, this.urlKeywords);
      }

      // full URLs based on the provided URL args
      return this.urlKeywords.reduce<string[]>(
        (result, website) => [...result, ...this.handlePort(website)],
        [],
      );
    }

    // search query
    if (this.withKeywords) {
      return this.getSearchQueries(engine);
    }

    // engine only
    return this.handlePort(
      typeof engine === 'string' ? engine : engine.baseUrl,
    );
  }

  /**
   * Returns a list of base URLs with port numbers
   * (if --port option was provided), and without the protocol
   */
  private handlePort(baseUrl: string): string[] {
    const protocol: string = extractProtocol(baseUrl) ?? '';
    const noProtocolUrl: string = removeProtocol(baseUrl);

    function hasPort(): boolean {
      return patterns.port.test(baseUrl);
    }

    /**
     * Returns a URL with protocol and port
     */
    function getFullUrl(port: number): string {
      // provided URL includes a port
      const matches = noProtocolUrl.match(patterns.port);
      if (matches != null) {
        const [, urlPort] = matches;

        // remove the port from the string if it does not match
        const index = noProtocolUrl.indexOf(':');
        if (urlPort !== port.toString() && index >= 0) {
          const noPortUrl = noProtocolUrl.substring(0, index);
          // 1 is to account for the length of ":"
          const afterPort = noProtocolUrl.substring(index + 1 + urlPort.length);
          return `${protocol}${noPortUrl}:${port}${afterPort}`;
        }

        // provided URL if port matches what's in the string
        return baseUrl;
      }

      // provided URL does not include a port
      const slashIndex = noProtocolUrl.indexOf('/');
      const hostName =
        slashIndex > 0 ? noProtocolUrl.substring(0, slashIndex) : noProtocolUrl;
      const pathName =
        slashIndex > 0 ? noProtocolUrl.substring(slashIndex) : '';

      return `${protocol}${hostName}:${port}${pathName}`;
    }

    if (this.port != null) {
      if (Array.isArray(this.port)) {
        const result = this.port.map((port) => getFullUrl(port));
        return hasPort() && !result.includes(baseUrl)
          ? [baseUrl, ...result]
          : result;
      }

      const url = getFullUrl(this.port);
      return hasPort() && baseUrl !== url ? [baseUrl, url] : [url];
    }

    return [baseUrl];
  }

  /**
   * Returns a list of provided URLs with the protocol
   */
  private handleProtocol(urls?: string[]): string[] {
    return (urls ?? []).map((url) => {
      const hasProtocol = /^https?:\/\//is.test(url);
      const protocol = `http${this.http ? '' : 's'}://`;
      const fullUrl = `${protocol}${removeProtocol(url)}`;
      return new URL(hasProtocol ? url : fullUrl).href;
    });
  }

  /**
   * Returns simple search query URLs
   */
  private getSearchQueries(
    engine: EngineType | null,
    values = this.keywords,
  ): string[] {
    if (engine == null) {
      return [];
    }

    if (this.split) {
      if (typeof engine !== 'string' && engine.query == null) {
        return this.getEngineBaseUrls(engine);
      }

      return values.reduce<string[]>(
        (result, value) => [
          ...result,
          ...this.getEngineQueryUrls(engine, value),
        ],
        [],
      );
    }

    const delimiter = typeof engine !== 'string' ? engine.delimiter : ' ';
    return this.getEngineQueryUrls(engine, values.join(delimiter));
  }

  /**
   * Returns a list of URLs with routes for the provided URL
   */
  private getUrlRouteQueries = (
    url: string,
    useNonUrlKeywords = false,
  ): string[] => {
    const handleKeywords = (urlWithRoute: string): string[] => {
      const keywords = useNonUrlKeywords ? this.nonUrlKeywords : this.keywords;
      if (keywords.length > 0) {
        return keywords.map(
          (keyword) => slash.trailing.add(urlWithRoute) + keyword,
        );
      }
      return [urlWithRoute];
    };

    // multiple routes
    if (Array.isArray(this.route)) {
      return this.route.reduce<string[]>(
        (result, route) => [
          ...result,
          ...handleKeywords(slash.trailing.add(url) + route),
        ],
        [],
      );
    }

    // single route
    if (this.route != null) {
      return handleKeywords(slash.trailing.add(url) + this.route);
    }

    // no routes
    return [url];
  };

  /**
   * Returns a list of URLs with routes for the provided engine
   *
   * @param value
   * if provided, it is added to the URL after a forward-slash
   */
  private getEngineRouteQueries(engine: EngineType, value?: string): string[] {
    const createRoute = (route: string): string[] => {
      const engineRoutes = this.getEngineRouteUrls(engine, route);
      return engineRoutes.map((engineRoute) =>
        value != null
          ? slash.trailing.add(engineRoute) + value.toString()
          : engineRoute,
      );
    };

    if (Array.isArray(this.route)) {
      return this.route
        .filter((route) => route !== '')
        .reduce<
          string[]
        >((result, route) => [...result, ...createRoute(route)], []);
    }

    if (this.route != null) {
      return createRoute(this.route);
    }

    return [];
  }

  /**
   * Returns a list of base URLs with a trailing forward slash
   * and ports, if the --port option was provided
   */
  private getEngineBaseUrls(engine: EngineType): string[] {
    const engineUrl = typeof engine === 'string' ? engine : engine.baseUrl;
    return this.handlePort(engineUrl).map((url) => slash.trailing.add(url));
  }

  /**
   * Returns a list of URLs that can be used to query
   * the provided engine by adding the search values
   */
  private getEngineQueryUrls(
    engine: EngineType,
    queryValues: string,
  ): string[] {
    if (typeof engine === 'string') {
      const engineUrls = this.handlePort(engine);
      return engineUrls.map(
        (url) =>
          (url.endsWith('=') ? url : slash.trailing.add(url)) + queryValues,
      );
    }

    const baseUrls = this.getEngineBaseUrls(engine);
    if (engine.query != null) {
      const queryString = slash.leading.remove(engine.query);
      return baseUrls.map((url) => url + queryString + queryValues);
    }

    return baseUrls;
  }

  /**
   * Returns a list of route URLs for the provided engine
   *
   * @param route
   * if it refers to a route in the engine's object, then the URL is built
   * using the object's route value, otherwise the argument itself is used
   * to create the URL
   */
  private getEngineRouteUrls(engine: EngineType, route: string): string[] {
    if (typeof engine !== 'string') {
      const found = Object.entries(engine.routes ?? {}).find(
        ([key]) => key === route,
      );

      if (found != null) {
        const [, routePath] = found;
        const baseUrls = this.getEngineBaseUrls(engine);
        return baseUrls.map((baseUrl) => baseUrl + routePath);
      }
    }

    const baseUrls = this.getEngineBaseUrls(engine);
    return baseUrls.map((baseUrl) => baseUrl + route);
  }
}
