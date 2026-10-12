interface NestedStringObject {
  [key: string]: string | NestedStringObject;
}

export interface QueryObject {
  [key: string]: string | NestedStringObject;
  main: string;
}

export type ResourceObject = NestedStringObject;

export type QueryPathConfig = string | QueryObject | undefined;
export type ResourceConfig = NestedStringObject | undefined;

export interface SiteConfig<
  S extends QueryPathConfig,
  R extends ResourceConfig,
> {
  query?: S;
  resources?: R;
  delimiter?: string;
}

export type QueryPathGetterFn<S extends QueryPathConfig> = (
  query?: S,
) => string | string[];

export type ResourceGetterFn<R extends ResourceConfig> = (
  resourcesConfig?: R,
) => string | string[];

export interface SharedOptions {
  /**
   * Port number to be used.
   *
   * - If array if provided, each value creates a separate URL
   * with that `port`
   */
  port?: number | number[];
  /**
   * Uses unsecure `http://` protocol
   */
  unsecureHttp?: boolean;
}

export interface QueryMethodOptions<
  S extends QueryPathConfig,
> extends SharedOptions {
  /**
   * String that represents a URL segment that's placed before
   * the search keywords and allows to ***search*** the site.
   *
   * - If array is provided, each value creates a separate URL
   * with keywords provided to that `queryPath`
   *
   * For example, the value for Google is `search?q=`
   * as seen in the following sample URL:
   *
   * `https://google.com/search?q=keywords`
   *
   */
  queryPath?: string | string[] | QueryPathGetterFn<S>;
  /**
   * Creates a separate URL for each keyword in the search query
   */
  split?: boolean;
}

export interface ResourceMethodOptions<
  R extends ResourceConfig,
> extends SharedOptions {
  /**
   * String that represents a deeper path within the resource.
   *
   * - If array is provided, each value creates a separate URL
   * for that particular `path`
   *
   * For example, for a Github's resource like your `username`,
   * a path `my-project` will create the following URL:
   * `https://github.com/username/my-project`
   *
   * - Path can include forward-slashes to specify a deeper level
   * of access within the resource's structure,
   * e.g. a value `my-project/tree/dev/src` will create
   * `https://github.com/username/my-project/tree/dev/src`
   *
   * - If path starts with `?`, it is added to the resource as is
   * without being separated by `/`
   *
   * @example
   * const github = new Site('github.com', {
   *   resources: {
   *     profile: 'username',
   *     tabs: {
   *       repos: '?tab=repositories',
   *       stars: '?tab=stars'
   *     }
   *   }
   * });
   *
   * const urls = github.resource(({ profile }) => profile, {
   *   path: ({ tabs }) => [tabs.repos, tabs.stars],
   * });
   *
   * console.log(urls);
   * // Expected array with URLs:
   * // https://github.com/username?tab=repositories
   * // https://github.com/username?tab=stars
   *
   */
  path?: string | string[] | ResourceGetterFn<R>;
}
