import type { ConfigBrowser, ConfigSite } from '@app-types/config.types.js';

export function sortConfigData<
  T extends ConfigSite | ConfigBrowser,
  Config extends Record<string, T>,
>(config: Config): Config {
  const sortedKeys = Object.keys(config);
  sortedKeys.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const [defaultKey] =
    Object.entries(config).find(([_key, v]) => v?.default) ?? [];

  const sortReducer = (acc: Config, key: string): Config => ({
    ...acc,
    [key]: config[key],
  });

  return defaultKey != null
    ? {
        [defaultKey]: config[defaultKey],
        ...sortedKeys
          .filter((key) => key.toLowerCase() !== defaultKey.toLowerCase())
          .reduce(sortReducer, {} as Config),
      }
    : sortedKeys.reduce(sortReducer, {} as Config);
}
