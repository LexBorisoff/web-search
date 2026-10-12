import { Browser } from '@api/browser/browser.js';
import { dataArgs } from '@command/args/data-args.js';
import { defaultsData } from '@data/defaults.js';
import { findBrowser } from '@helpers/find-browser.js';

import { getProfilesConfig } from './get-profiles-config.js';

import type { QueryBrowser } from '@app-types/query.types.js';

const browserArgs = dataArgs.browser();

export function getQueryBrowsers(): QueryBrowser[] {
  if (browserArgs.length === 0) {
    if (defaultsData.browser == null) {
      return [];
    }

    const [defaultBrowserName, defaultBrowser] = defaultsData.browser;
    return [
      [
        defaultBrowserName,
        new Browser(defaultBrowser.appPath ?? defaultBrowserName, {
          profiles: getProfilesConfig(defaultBrowserName),
        }),
      ],
    ];
  }

  return browserArgs.map((browserNameOrAlias) => {
    const [browserName, browser] = findBrowser(browserNameOrAlias) ?? [
      browserNameOrAlias,
    ];

    return [
      browserName,
      new Browser(browser?.appPath ?? browserName, {
        profiles: getProfilesConfig(browserName),
      }),
    ];
  });
}
