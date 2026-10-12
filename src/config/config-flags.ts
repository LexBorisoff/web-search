import { browsersData, sitesData, getProfilesData } from '@data/config-data.js';

import type { WithAlias } from '@app-types/config.types.js';

interface Data<T> {
  [key: string]: T;
}

/**
 * Returns a flat array of names and aliases from the config
 * based on the provided config data
 */
function getFlags<T extends WithAlias>(
  data: Data<T>,
  includeSingleLetterAlias = true,
): string[] {
  return Object.entries(data)
    .map(([key, { alias }]) => {
      if (alias != null) {
        const aliases = Array.isArray(alias) ? alias : [alias];
        const filter = (a: string): boolean =>
          includeSingleLetterAlias || a.length > 1;
        return [key, ...aliases.filter(filter)];
      }
      return key;
    })
    .flat();
}

/** a list of all browser keys and aliases in the config */
export const configBrowserFlags = getFlags(browsersData);

type BrowserProfileFlags = Partial<Record<string, string[]>>;

/** profile keys and aliases per each browser */
export const browserProfileFlags: BrowserProfileFlags = {};

/** a list of all profile keys WITHOUT aliases in the config */
export const configProfileFlags = Object.keys(browsersData)
  .map((browserName) => {
    const profilesData = getProfilesData(browserName);
    browserProfileFlags[browserName] = getFlags(profilesData);
    return getFlags(profilesData, false);
  })
  .flat();

/** a list of all site keys and aliases in the config */
export const configSiteFlags = getFlags(sitesData);

/**
 * A list of identifiers (keys and aliases) from config data:
 * - browsers
 * - profiles (no aliases)
 * - sites
 */
export const configFlags = [
  ...configBrowserFlags,
  ...configProfileFlags,
  ...configSiteFlags,
];
