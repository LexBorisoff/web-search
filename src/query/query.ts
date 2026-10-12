import { validateArgs } from '@command/args/validate-args.js';
import { logger } from '@utils/logger.js';

import { getQuerySites } from './get-query-sites.js';
import { getUrls } from './get-urls.js';
import { openUrls } from './open-urls.js';
import { printQuery } from './print-query.js';

export function query(): void {
  const errors = validateArgs();
  if (errors.length > 0) {
    errors.forEach((message) => {
      logger(message);
    });
    return;
  }

  const sites = getQuerySites();
  const urls: string[] = sites.map(([, site]) => getUrls(site)).flat();
  const browserQueries = openUrls(urls);

  printQuery(urls, browserQueries);
}
