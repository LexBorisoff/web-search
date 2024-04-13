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
  split?: boolean;
}

export interface SearchConfig<
  SearchOption extends string | SearchObject | undefined,
> extends SharedConfig {
  query?: string | string[] | QueryGetterFn<SearchOption>;
  unsecureHttp?: boolean;
}

export interface NavigateConfig<
  ResourceOption extends ResourceObject | undefined,
> extends SharedConfig {
  directory?: string | string[] | ResourceGetterFn<ResourceOption>;
}
