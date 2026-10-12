import { sitesData, browsersData, getProfilesData } from './config-data.js';

import type { DefaultsData, WithDefault } from '@app-types/config.types.js';

const [siteFallback] = Object.entries(sitesData);

export const defaultDelimiter = ' ';

function getDefault<Data extends WithDefault>(
  data: Data,
): [string, Data[keyof Data]] | null {
  const withDefault = Object.entries(data).find(
    ([, item]: [key: string, item: Data]) => !!item.default,
  );

  if (withDefault != null) return withDefault;

  const first = Object.entries(data).at(0);
  if (first != null) return first;

  return null;
}

const getDefaultProfile: DefaultsData['profile'] = (browserName) => {
  const profiles = getProfilesData(browserName);
  return getDefault(profiles);
};

export const defaultsData: DefaultsData = {
  delimiter: defaultDelimiter,
  site: getDefault(sitesData) ?? siteFallback,
  browser: getDefault(browsersData),
  profile: getDefaultProfile,
};
