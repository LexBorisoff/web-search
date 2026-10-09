import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { matchers } from '@api/matchers/matchers.js';
import { configFlags } from '@config/config-flags.js';
import { getPackageJson } from '@utils/get-package-json.js';

import {
  QueryOptions as Options,
  queryAlias as alias,
  queryOptions as options,
  queryOptionTypes as types,
} from '../options.js';

import type { ArrayArgs } from '@app-types/arg.types.js';

const version = getPackageJson().version!;

const group = {
  browser: 'Browser Options:',
  site: 'Site Options:',
  other: 'Other Options:',
};

const args = yargs(hideBin(process.argv))
  .option(Options.Browser, {
    type: types[Options.Browser],
    alias: alias.browser,
    description: 'The browser app to open',
    group: group.browser,
  })
  .option(Options.Profile, {
    type: types[Options.Profile],
    alias: alias.profile,
    description: 'The browser profile to open',
    group: group.browser,
  })
  .option(Options.Incognito, {
    type: types[Options.Incognito],
    alias: alias.incognito,
    description: 'Open in incognito / private mode',
    group: group.browser,
  })
  .option(Options.Site, {
    type: types[Options.Site],
    alias: alias.site,
    description: 'The website to search',
    group: group.site,
  })
  .option(Options.Query, {
    type: types[Options.Query],
    alias: alias.query,
    description: "The website's query path to use for searching",
    group: group.site,
  })
  .option(Options.Resource, {
    type: types[Options.Resource],
    alias: alias.resource,
    description: "The website's resource to access",
    group: group.site,
  })
  .option(Options.Delimiter, {
    type: types[Options.Delimiter],
    alias: alias.delimiter,
    description: "The website's delimiter to separate search terms",
    group: group.site,
  })
  .option(Options.Port, {
    type: types[Options.Port],
    alias: alias.port,
    description: 'The port number to add to the URL',
    group: group.site,
  })
  .option(Options.Http, {
    type: types[Options.Http],
    alias: alias.http,
    description: 'Use the HTTP (non-secure) protocol',
    group: group.site,
  })
  .option(Options.Split, {
    type: types[Options.Split],
    alias: alias.split,
    description: 'Create a separate search query for each search term',
    group: group.other,
  })
  .option(Options.DryRun, {
    type: types[Options.DryRun],
    alias: alias.dryrun,
    description: 'Display the output without opening browser tabs',
    group: group.other,
  })
  .help()
  .version(version)
  .hide('help')
  .hide('version')
  .boolean(configFlags.filter((flag) => !options.includes(flag)))
  .parseSync();

const arrayArgs: ArrayArgs = {
  browser: args.browser,
  profile: args.profile,
  site: args.site,
  query: args.query,
  resource: args.resource,
  port: args.port,
};

const _ = args._.map((arg) => `${arg}`);

const urlsOnly: boolean =
  _.length > 0 && _.every((arg) => matchers.url.test(arg));

/**
 * Is populated only if all value args are URLs
 */
const urlArgs = urlsOnly ? _ : undefined;

const queryArgs = {
  ...args,
  ...arrayArgs,
  _,
};

// delete undefined properties
type QueryArgs = typeof queryArgs;
for (const key of Object.keys(queryArgs) as (keyof QueryArgs)[]) {
  if (args[key] == null) {
    delete queryArgs[key as keyof QueryArgs];
  }
}

export { queryArgs, urlArgs };
