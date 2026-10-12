import { findBrowser } from '@helpers/find-browser.js';

import type { ProfilesConfig } from '@api/browser/browser.types.js';

export function getProfilesConfig(
  browserNameOrAlias: string,
): ProfilesConfig | undefined {
  const [, browser] = findBrowser(browserNameOrAlias) ?? [];

  return browser == null
    ? undefined
    : Object.entries(browser.profiles ?? {}).reduce<ProfilesConfig>(
        (result, [key, profile]) => ({
          ...result,
          [key]: typeof profile === 'string' ? profile : profile.directory,
        }),
        {},
      );
}
