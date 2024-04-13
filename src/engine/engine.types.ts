export interface SearchObject {
  [key: string]: string;
  main: string;
}

export interface ResourceObject {
  [key: string]: string;
}

export interface EngineOptions<
  SearchOption extends string | SearchObject,
  ResourceOption extends string | ResourceObject,
> {
  search?: SearchOption;
  resources?: ResourceOption;
  delimiter?: string;
}

export type QueryGetterFn<SearchOption extends string | SearchObject> = (
  search: SearchOption,
) => string | string[];

export type ResourceGetterFn<ResourceOption extends ResourceObject> = (
  resource: ResourceOption,
) => string | string[];

export interface SharedConfig {
  port?: number | number[];
  split?: boolean;
}

export interface SearchConfig<SearchOption extends string | SearchObject>
  extends SharedConfig {
  query?: string | string[] | QueryGetterFn<SearchOption>;
  unsecureHttp?: boolean;
}

export interface NavigateConfig extends SharedConfig {
  directory?: string | string[];
}
