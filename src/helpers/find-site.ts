import { sitesData } from '@data/config-data.js';
import { initialSites } from '@data/initial-sites.js';

import { findConfigItem } from './find-config-item.js';

import type { ConfigSite } from '@app-types/config.types.js';

/**
 * Returns a tuple with the site's config key and the Site object
 * if it can be found in the config by the provided name or alias.
 * Otherwise returns undefined
 */
export function findSite(siteArg?: string): [string, ConfigSite] | undefined {
  if (siteArg == null) {
    return undefined;
  }

  const hasSitesData = Object.keys(sitesData).length > 0;

  return findConfigItem(siteArg, hasSitesData ? sitesData : initialSites);
}
