import { configProfileFlags } from '@config/config-flags.js';
import { sitesData, browsersData, getProfilesData } from '@data/config-data.js';

import { queryOptions } from '../options.js';

import { queryArgs } from './query-args.js';

import type { WithAlias } from '@app-types/config.types.js';

interface Data<T> {
  [key: string]: T;
}

/**
 * Returns a combined list of values that were supplied to the CLI
 * as standard options and custom flags
 */
function combineArgLists(
  optionArg: string | string[] | undefined,
  customArgs: string[] = [],
): string[] {
  const argList = [...customArgs];
  if (optionArg != null) {
    argList.push(...(Array.isArray(optionArg) ? optionArg : [optionArg]));
  }

  return argList;
}

/**
 * Returns a unique list of non-nullable args
 */
function getUniqueList(
  optionArg: string | string[] | undefined,
  customArgs: string[] = [],
  removeEmptyArg: boolean = true,
): string[] {
  const list = combineArgLists(optionArg, customArgs);
  const uniqueList = [...new Set(list)];
  return removeEmptyArg ? uniqueList.filter((arg) => arg !== '') : uniqueList;
}

/**
 * Returns a list of arg options supplied to the CLI that are
 * specific to config data and do not match standard args
 */
function getCustomArgs<T extends WithAlias>(data: Data<T>): string[] {
  const customFlags = Object.keys(queryArgs).filter(
    (key) => !queryOptions.includes(key),
  );
  return Object.entries(data)
    .map(([key, { alias }]) => {
      if (alias != null) {
        return Array.isArray(alias) ? [key, ...alias] : [key, alias];
      }
      return key;
    })
    .flat()
    .filter((nameOrAlias) => customFlags.includes(nameOrAlias));
}

export const dataArgs = {
  /**
   * Returns a unique list of browser args provided to the CLI
   *
   * @param removeEmptyArg
   * If true, removes the empty value from the list
   */
  browser: function getBrowserArgs(removeEmptyArg = true): string[] {
    const customArgs = getCustomArgs(browsersData);
    return getUniqueList(queryArgs.browser, customArgs, removeEmptyArg);
  },

  /**
   * Returns a unique list of profile args provided to the CLI.
   *
   * @param browserName
   * If value is provided, returns profile args for that browser name,
   * otherwise returns all profile args supplied to the CLI
   *
   * @param removeEmptyArg
   * If true, removes an empty arg value from the list
   */
  profile: function getProfileArgs(
    browserName?: string | null,
    removeEmptyArg = true,
  ): string[] {
    const { profile } = queryArgs;

    if (browserName == null) {
      const list: string[] = [];

      // push option arg values (--profile <name>) to the list
      if (profile != null) {
        list.push(...(Array.isArray(profile) ? profile : [profile]));
      }

      // push custom args (--profileName) to the list
      Object.keys(browsersData).forEach((arg) => {
        const profilesData = getProfilesData(arg);
        const customArgs = getCustomArgs(profilesData);

        // filter out short aliases
        const profileArgs = customArgs.filter((profileArg) =>
          configProfileFlags.includes(profileArg),
        );

        list.push(...profileArgs);
      });

      return [
        ...new Set(removeEmptyArg ? list.filter((arg) => arg !== '') : list),
      ];
    }

    const profilesData = getProfilesData(browserName);
    const customArgs = getCustomArgs(profilesData);

    // filter out short aliases
    const profileArgs = customArgs.filter((profileArg) =>
      configProfileFlags.includes(profileArg),
    );

    return getUniqueList(profile, profileArgs, removeEmptyArg);
  },

  /**
   * Returns a unique list of site args provided to the CLI
   *
   * @param removeEmptyArg
   * If true, removes the empty value from the list
   */
  site: function getSiteArgs(removeEmptyArg = true): string[] {
    const customArgs = getCustomArgs(sitesData);
    return getUniqueList(queryArgs.site, customArgs, removeEmptyArg);
  },

  /**
   * Returns a unique list of port args provided to the CLI
   *
   * @param removeEmptyArg
   * If true, removes the empty value from the list
   */
  port: function getPortArgs(): number[] {
    const ports = Array.isArray(queryArgs.port)
      ? queryArgs.port
      : [queryArgs.port];
    const uniquePorts = [...new Set(ports)];

    return uniquePorts.filter((port): port is number => port != null);
  },
};
