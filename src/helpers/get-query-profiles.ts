import { dataArgs } from '@command/args/data-args.js';
import { defaultsData } from '@data/defaults.js';

import { findProfile } from './find-profile.js';

import type { Profile } from '@app-types/config.types.js';

function hasProfile(browserName: string): boolean {
  return (
    dataArgs.profile(browserName).length > 0 ||
    defaultsData.profile(browserName) != null
  );
}

/**
 * Returns a list of tuples with profile's config key
 * and the Profile object for a provided browser name
 */
export function getQueryProfiles(browserName: string): [string, Profile][] {
  const profiles: [string, Profile][] = [];

  function handleProfile(profileNameOrAlias: string): void {
    const found = findProfile(browserName, profileNameOrAlias);

    profiles.push(
      found != null
        ? found
        : [profileNameOrAlias, { directory: profileNameOrAlias }],
    );
  }

  if (hasProfile(browserName)) {
    const profileArgs = dataArgs.profile(browserName);
    const defaultProfile = defaultsData.profile(browserName);

    if (profileArgs.length > 0) {
      profileArgs.forEach((profileNameOrAlias) => {
        handleProfile(profileNameOrAlias);
      });
    } else if (defaultProfile != null) {
      const [profileName] = defaultProfile;
      handleProfile(profileName);
    }
  }

  return profiles;
}
