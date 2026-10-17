import { matchers } from '@api/matchers/matchers.js';
import { sitesData } from '@data/config-data.js';
import { initialSites } from '@data/initial-sites.js';

import { findConfigItem } from './find-config-item.js';

import type { ConfigSite, SitesData } from '@app-types/config.types.js';

export interface ConfigSiteWithPort extends ConfigSite {
  port?: number;
}

function findConfigSite(
  siteArg: string,
  list: SitesData,
): [string, ConfigSiteWithPort] | undefined {
  let port: string | undefined;

  if (matchers.flagWithPort.test(siteArg)) {
    [siteArg, port] = siteArg.split(':');
  }

  const found = findConfigItem(siteArg, list);

  if (found == null) return undefined;
  if (port == null) return found;

  const [siteKey, configSite] = found;
  return [siteKey, { ...configSite, port: Number(port) }];
}

/**
 * Returns a tuple with the site's config key and the Site object
 * if it can be found in the config by the provided name or alias.
 * Otherwise returns undefined
 */
export function findSite(
  siteArg?: string,
): [string, ConfigSiteWithPort] | undefined {
  if (siteArg == null) {
    return undefined;
  }

  const hasSitesData = Object.keys(sitesData).length > 0;

  return findConfigSite(siteArg, hasSitesData ? sitesData : initialSites);
}
