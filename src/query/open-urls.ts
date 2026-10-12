import open from 'open';

import { queryArgs } from '@command/args/query-args.js';
import { getQueryProfiles } from '@helpers/get-query-profiles.js';

import { getQueryBrowsers } from './get-query-browsers.js';

import type { BrowserProfileQuery } from '@app-types/query.types.js';

const { dryrun, incognito } = queryArgs;

export function openUrls(urls: string[]): BrowserProfileQuery[] {
  const browsers = getQueryBrowsers();

  if (browsers.length === 0) {
    if (!dryrun) {
      Promise.all(
        urls.map((link) => {
          open(link);
        }),
      );
    }

    return [];
  }

  const queries = browsers.map<BrowserProfileQuery>(([browser]) => ({
    browser,
    profiles: getQueryProfiles(browser).map(([profile]) => profile),
  }));

  if (!dryrun) {
    Promise.all(
      browsers.map(([browserName, browser]) => {
        const browserProfiles = getQueryProfiles(browserName);
        browser.open(urls, {
          profile: browserProfiles.map(([, profile]) => profile.directory),
          incognito,
        });
      }),
    );
  }

  return queries;
}
