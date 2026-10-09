import type { PrimitiveTypeLiteral } from '@app-types/primitive.type.js';

type Alias<T extends string> = Partial<Record<T, string | string[]>>;

export const yargsOptions = ['_', '$0'];

// QUERY OPTIONS
export enum QueryOptions {
  Browser = 'browser',
  Profile = 'profile',
  Engine = 'engine',
  Search = 'search',
  Resource = 'resource',
  Delimiter = 'delimiter',
  Port = 'port',
  Incognito = 'incognito',
  Split = 'split',
  Http = 'http',
  Test = 'test',
}

export const queryOptionTypes = {
  [QueryOptions.Browser]: 'string' as const,
  [QueryOptions.Profile]: 'string' as const,
  [QueryOptions.Engine]: 'string' as const,
  [QueryOptions.Search]: 'string' as const,
  [QueryOptions.Resource]: 'string' as const,
  [QueryOptions.Delimiter]: 'string' as const,
  [QueryOptions.Port]: 'number' as const,
  [QueryOptions.Incognito]: 'boolean' as const,
  [QueryOptions.Split]: 'boolean' as const,
  [QueryOptions.Http]: 'boolean' as const,
  [QueryOptions.Test]: 'boolean' as const,
} satisfies Record<QueryOptions, PrimitiveTypeLiteral>;

export const queryAlias: Alias<QueryOptions> = {
  browser: ['b'],
  profile: ['p'],
  engine: ['e'],
  search: ['s'],
  resource: ['r'],
  delimiter: ['d'],
  port: [':'],
  incognito: ['i'],
  test: ['t'],
};

/**
 * CLI options and their aliases (excluding config options)
 */
export const queryOptions: string[] = [
  ...Object.values(QueryOptions),
  ...Object.values(queryAlias).flat(),
];

// CONFIG OPTIONS
export enum ConfigOptions {
  Config = 'config',
}

/**
 * CLI options and their aliases related to config
 */
export const configOptions: string[] = Object.values(ConfigOptions);
