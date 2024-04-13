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
   * For example, for Google, the value is `search?q=`
   * (`http://google.com/search?q=keyword`).
   *
   * If array is provided, then each string creates a separate URL
   * with keywords used against that `query`
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
  directory?: string | string[] | ResourceGetterFn<ResourceOption>;
}
