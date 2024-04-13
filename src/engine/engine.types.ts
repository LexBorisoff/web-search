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

export interface EngineOptions<
  SearchOption extends string | SearchObject | undefined,
  ResourceOption extends string | ResourceObject | undefined,
> {
  search?: SearchOption;
  resources?: ResourceOption;
  delimiter?: string;
}

export type QueryGetterFn<
  SearchOption extends string | SearchObject | undefined,
> = (search: SearchOption) => string | string[];

export type ResourceGetterFn<
  ResourceOption extends ResourceObject | undefined,
> = (resource: ResourceOption) => string | string[];

export interface SharedConfig {
  port?: number | number[];
}

export interface SearchConfig<
  SearchOption extends string | SearchObject | undefined,
> extends SharedConfig {
  /**
   * String that's placed before the search keywords.
   *
   * - If array is provided, then each string creates a separate URL
   * with keywords provided to that `query`
   *
   * For example, for Google, the value is `search?q=`
   * as seen in the following sample URL:
   *
   * `https://google.com/search?q=keywords`
   */
  query?: string | string[] | QueryGetterFn<SearchOption>;
  /**
   * Creates a separate URL for each keyword in the search query
   */
  splitSearchQuery?: boolean;
  /**
   * Places search keywords immediately after the engine's
   * base URL instead of using the `query` property
   */
  useBaseUrl?: boolean;
  /**
   * Uses unsecure `http://` protocol
   */
  useUnsecureHttp?: boolean;
}

export interface NavigateConfig<
  ResourceOption extends ResourceObject | undefined,
> extends SharedConfig {
  /**
   * String that represents a directory within the resource.
   *
   * - If array is provided, then each string creates a separate URL
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
  directory?: string | string[] | ResourceGetterFn<ResourceOption>;
}
