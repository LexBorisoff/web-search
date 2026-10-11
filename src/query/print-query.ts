import chalk from 'chalk';

import { queryArgs } from '@command/args/query-args.js';
import { logger } from '@utils/logger.js';
import { capitalize } from '@utils/transform-text.js';

import type { BrowserProfileQuery } from '@app-types/query.types.js';

const { incognito, dryrun } = queryArgs;

export function printQuery(
  urls: string[],
  browserQueries: BrowserProfileQuery[],
): void {
  if (dryrun) {
    logger.warning('[no-execute]');
  }

  browserQueries.forEach((browserQuery) => {
    const { browser, profiles } = browserQuery;
    let browserInfo = logger.level.info(capitalize(browser));

    if (profiles.length > 0) {
      browserInfo += ` (${chalk.gray(profiles.join(', '))})`;
    }

    if (incognito) {
      browserInfo += chalk.gray(' [private tab]');
    }

    logger(browserInfo);
  });

  urls.forEach((url: string) => {
    logger(`> ${logger.level.success(url)}`);
  });
}
