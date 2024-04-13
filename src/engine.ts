type Routes = Record<string, string>;
interface EngineOptions {
  /**
   * A string representing a URL segment that allows to query the search engine.
   * For example, to search on google.com the value for the "query" option
   * is "search?q=".
   */
  query?: string;
  /**
   * An object with key-value pairs that defines a set of engine routes
   */
  routes?: Routes;
  /**
   * The delimiter used by the engine to separate search keywords.
   *
   * @default " " (single whitespace)
   */
  delimiter?: string;
}

export class Engine {
  public readonly delimiter: string;
  public readonly name?: string;
  public readonly query?: string;
  public readonly routes?: Routes;

  constructor(
    /**
     * Base domain URL like google.com or github.com
     */
    public readonly baseUrl: string,
    { query, routes, delimiter }: EngineOptions = {},
  ) {
    this.query = query;
    this.routes = routes;
    this.delimiter = delimiter ?? ' ';
  }
}
