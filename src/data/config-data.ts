import { load } from 'js-yaml';

import { useCoreActions } from '@actions/core-actions.js';
import { initialSites } from '@data/initial-sites.js';
import { yamlFiles } from '@utils/yaml-files.js';

import { CONFIG_FILE } from '../constants.js';

import { sortConfigData } from './sort-config-data.js';

import type {
  BrowsersConfig,
  BrowsersData,
  ConfigData,
  ConfigOption,
  ProfilesData,
  SitesConfig,
  SitesData,
} from '@app-types/config.types.js';

const configDir = useCoreActions(({ config }) => config);

function readConfig(option: ConfigOption): string | null {
  const found = yamlFiles(CONFIG_FILE(option)).find((fileName) =>
    configDir.exists(fileName),
  );
  return found != null ? configDir.readFile(found) : null;
}

const sitesConfigRaw = readConfig('sites');
const browsersConfigRaw = readConfig('browsers');

const configData: ConfigData = { sites: {}, browsers: {} };
if (sitesConfigRaw != null) {
  const { $schema, ...sites } = load(sitesConfigRaw) as SitesConfig;
  configData.sites = sortConfigData(sites);
}

if (browsersConfigRaw != null) {
  const { $schema, ...browsers } = load(browsersConfigRaw) as BrowsersConfig;
  const sorted = sortConfigData(browsers);

  // cast null values as empty objects
  configData.browsers = Object.entries(sorted).reduce((acc, [key, browser]) => {
    return { ...acc, [key]: browser === null ? {} : browser };
  }, sorted);
}

export { configData };

export const sitesData: SitesData = { ...initialSites, ...configData.sites };

export const browsersData: BrowsersData = configData.browsers ?? {};

export function getProfilesData(browserName: string): ProfilesData {
  return Object.entries(
    browsersData[browserName]?.profiles ?? {},
  ).reduce<ProfilesData>(
    (acc, [key, value]) =>
      ({
        ...acc,
        [key]: typeof value === 'string' ? { directory: value } : value,
      }) satisfies ProfilesData,
    {},
  );
}
