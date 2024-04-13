interface StringObject {
  [key: string]: string | StringObject;
}

export interface SearchObject {
  [key: string]: string | StringObject;
  main: string;
}

export interface ResourceObject {
  [key: string]: string | StringObject;
}

export type SearchConfig = string | SearchObject | undefined;
export type ResourceConfig = ResourceObject | undefined;

export interface EngineConfig<
  S extends SearchConfig,
  R extends ResourceConfig,
> {
  search?: S;
  resources?: R;
  delimiter?: string;
}

export type QueryGetterFn<S extends SearchConfig> = (
  search: S,
) => string | string[];

export type ResourceGetterFn<R extends ResourceConfig> = (
  resource: R,
) => string | string[];

export interface SharedConfig {
  /**
   * Port number to be used.
   *
   * - If array if provided, then each value creates a separate URL
   * with that `port`
   */
  port?: number | number[];
}

export interface SearchMethodOptions<S extends SearchConfig>
  extends SharedConfig {
  /**
   * String that represents a URL segment that's placed before
   * the search keywords and allows to ***search*** the engine.
   *
   * - If array is provided, then each value creates a separate URL
   * with keywords provided to that `query`
   *
   * For example, the value for Google is `search?q=`
   * as seen in the following sample URL:
   *
   * `https://google.com/search?q=keywords`
   *
   */
  query?: string | string[] | QueryGetterFn<S>;
  /**
   * Creates a separate URL for each keyword in the search query
   */
  splitSearchQuery?: boolean;
  /**
   * Uses unsecure `http://` protocol
   */
  useUnsecureHttp?: boolean;
}

export interface NavigateMethodOptions<R extends ResourceConfig>
  extends SharedConfig {
  /**
   * String that represents a directory within the resource.
   *
   * - If array is provided, then each value creates a separate URL
   * for that particular `directory`
   *
   * For example, for a Github's resource like your `username`,
   * a directory `my-project` will create the following URL:
   * `https://github.com/username/my-project`
   *
   * - Directory can include forward-slashes to specify a deeper level
   * of access within the resource's directory structure,
   * e.g. a value `my-project/tree/dev/src` will create
   * `https://github.com/username/my-project/tree/dev/src`
   */
  directory?: string | string[] | ResourceGetterFn<R>;
}
