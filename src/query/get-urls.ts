import { dataArgs } from '@command/args/data-args.js';
import { queryArgs, urlArgs } from '@command/args/query-args.js';
import { findNested } from '@helpers/find-nested.js';

import type { Site } from '@api/site/site.js';
import type {
  ResourceConfig,
  ResourceObject,
  SearchPathConfig,
} from '@api/site/site.types.js';

const { _: args, resource, http } = queryArgs;
const siteArgs = dataArgs.site();
const portArgs = dataArgs.port();
const port = portArgs.length === 0 ? undefined : portArgs;

// if there are no site args and all value args are URLs,
// remove URL args from keywords list because they are used as sites
const keywords: string[] = args.filter(
  (keyword) => siteArgs.length > 0 || !urlArgs || !urlArgs.includes(keyword),
);

function handleResource(
  site: Site<SearchPathConfig, ResourceConfig>,
  resourceValue: string,
): string[] {
  const splitter = '::';

  function findResourceByValue(resources: ResourceObject): string | null {
    return findNested<string>(resources, resourceValue, resourceValue);
  }

  return site.resource(
    (config = {}) => {
      // NOTE: resource object has a property key containing the splitter
      const foundResourceValue = findResourceByValue(config);
      if (foundResourceValue != null) {
        return foundResourceValue;
      }

      const [resourceKey] = resourceValue.split(splitter);
      const isEscaped = resourceKey.startsWith('/');
      // do not search in config if resource key starts with slash
      return isEscaped
        ? resourceKey.slice(1)
        : (findNested<string>(config, resourceKey, resourceKey) ?? resourceKey);
    },
    {
      path(config = {}) {
        const foundResource = findResourceByValue(config);

        // Relates to the NOTE in the above callback
        // Add path found by splitted path key only if resource does not include the splitter
        if (foundResource == null) {
          const pathKeys = resourceValue.split(splitter).slice(1);

          if (pathKeys.length > 0) {
            const result = pathKeys
              .reduce<string[]>((acc, pathKey) => {
                const isEscaped = pathKey.startsWith('/');
                acc.push(
                  // do not search in config if path key starts with slash
                  isEscaped
                    ? pathKey.slice(1)
                    : (findNested<string>(config, pathKey, pathKey) ?? pathKey),
                );

                return acc;
              }, [])
              .reduce<string>((acc, value) => {
                return `${acc}${value.startsWith('?') ? value : `/${value}`}`;
              }, '');

            return [...keywords, result];
          }
        }

        return keywords;
      },
      port,
      unsecureHttp: http,
    },
  );
}

function handleSearchPath(
  config: SearchPathConfig = { main: '/' },
): string | string[] {
  function getQuery(search: string): string {
    return typeof config !== 'string'
      ? (findNested<string>(config, search, search) ?? search)
      : search;
  }

  const { query } = queryArgs;

  if (query == null) {
    return typeof config === 'string' ? config : config.main;
  }

  if (Array.isArray(query)) {
    return query.map((s) => getQuery(s));
  }

  return getQuery(query);
}

export function getUrls(
  site: Site<SearchPathConfig, ResourceConfig>,
): string[] {
  if (resource != null) {
    return Array.isArray(resource)
      ? resource.map((r) => handleResource(site, r)).flat()
      : handleResource(site, resource);
  }

  return site.search(keywords.join(' '), {
    searchPath: handleSearchPath,
    port,
    split: queryArgs.split,
    unsecureHttp: queryArgs.http,
  });
}
