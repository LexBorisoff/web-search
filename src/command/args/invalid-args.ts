import { configFlags } from '@config/config-flags.js';

import { queryOptions, yargsOptions } from '../options.js';

import { queryArgs } from './query-args.js';

/**
 * A list of args that do not match CLI and yargs' options,
 * or the custom flags derived from the config's site, browser,
 * and profile values. Does not check against config options.
 */
export const invalidArgs = Object.keys(queryArgs)
  .filter((key) => !yargsOptions.includes(key))
  .filter((key) => ![...queryOptions, ...configFlags].includes(key));
