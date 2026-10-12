import chalk from 'chalk';

import { matchers } from '@api/matchers/matchers.js';
import { configSiteFlags, browserProfileFlags } from '@config/config-flags.js';
import { defaultsData } from '@data/defaults.js';
import { getBrowserName } from '@helpers/get-browser-name.js';
import { logger } from '@utils/logger.js';

import { QueryOptions as Options } from '../options.js';

import { dataArgs } from './data-args.js';
import { invalidArgs } from './invalid-args.js';
import { queryArgs, urlArgs } from './query-args.js';

const { italic } = chalk;
const { resource, query, delimiter } = queryArgs;
const siteArgs = dataArgs.site(false);
const browserArgs = dataArgs.browser(false);
const portArgs = dataArgs.port();

const validate = {
  profiles: false,
};

const errorMessages: string[] = [];

function addMessage(message: string): void {
  errorMessages.push(message);
}

function isEmptyArg(list: string[]): boolean {
  return list.length === 1 && list[0] === '';
}

function noValueError(option: Options): void {
  addMessage(
    logger.level.error(`${italic(`--${option}`)} option must have a value`),
  );
}

function validateResource(
  value: string | string[],
  option: Options.Resource | Options.Query,
  allowUrlArgs = true,
): void {
  const emptyArg = !Array.isArray(value) && value === '';
  const emptyList = Array.isArray(value) && value.every((arg) => arg === '');

  if (emptyArg || emptyList) {
    noValueError(option);
  }

  if (siteArgs.length === 0 && (!allowUrlArgs || !urlArgs)) {
    addMessage(
      logger.level.error(
        `${italic(`--${option}`)} option must be used with --engine${allowUrlArgs ? ' or URL' : ''}`,
      ),
    );
  }
}

/**
 * Validates profile args
 *
 * @param browser
 * * If a single string is provided - profile args are checked against
 * profile keys and aliases of the provided config browser
 * * String array, null or undefined - profile args are validated against
 * profile keys and aliases of all config browsers
 */
function validateProfileArgs(browser?: string | string[] | null): void {
  const profileArgs = dataArgs.profile(
    browser == null || Array.isArray(browser) ? null : browser,
    false,
  );

  if (isEmptyArg(profileArgs)) {
    noValueError(Options.Profile);
  }

  let flags: { [browserName: string]: string[] } = {};

  if (browser != null) {
    (Array.isArray(browser) ? browser : [browser]).forEach(
      (browserNameOrAlias) => {
        const browserName = getBrowserName(browserNameOrAlias);
        const profileFlags = browserProfileFlags[browserName];

        flags = {
          ...flags,
          [browserName]: profileFlags ?? [],
        };
      },
    );
  }

  const invalidProfiles = profileArgs.filter(
    (arg) => arg !== '' && !Object.values(flags).flat().includes(arg),
  );

  if (invalidProfiles.length > 0) {
    addMessage(
      logger.level.error(
        `Invalid profiles: ${logger.level.warning(invalidProfiles.join(' '))}`,
      ),
    );
  }
}

/**
 * Returns an array of error messages with invalid args
 * (empty array if all args are valid)
 */
export function validateArgs(): string[] {
  /* ~~~ VALIDATE CLI ARGS ~~~ */
  if (invalidArgs.length > 0) {
    addMessage(
      logger.level.error(
        `Invalid options: ${logger.level.warning(invalidArgs.join(', '))}`,
      ),
    );
  }

  /* ~~~ VALIDATE SITE ARGS ~~~  */

  if (isEmptyArg(siteArgs)) {
    noValueError(Options.Site);
  }

  const invalidSites = siteArgs.filter(
    (arg) =>
      arg !== '' && !configSiteFlags.includes(arg) && !matchers.url.test(arg),
  );

  if (invalidSites.length > 0) {
    addMessage(
      logger.level.error(
        `Invalid sites: ${logger.level.warning(invalidSites.join(' '))}`,
      ),
    );
  }

  /* ~~~ VALIDATE RESOURCE ARGS ~~~ */

  if (resource != null) {
    validateResource(resource, Options.Resource);
  }

  /* ~~~ VALIDATE SEARCH ARGS ~~~ */

  if (query != null) {
    validateResource(query, Options.Query, false);
  }

  /* ~~~ VALIDATE DELIMITER ARGS ~~~ */

  if (delimiter != null) {
    if (Array.isArray(delimiter)) {
      addMessage(
        logger.level.error(
          `Multiple ${italic('--delimiter')} options are not allowed`,
        ),
      );
    }

    if (delimiter === '') {
      noValueError(Options.Delimiter);
    }
  }

  /**
   * ~~~ VALIDATE BROWSER ARGS ~~~
   *
   * Only an empty browser option should is checked.
   * A browser value that does not exist in the config should still be valid
   * because it is an app that should be attempted to open
   */

  if (isEmptyArg(browserArgs)) {
    noValueError(Options.Browser);
  }

  /* ~~~ VALIDATE PROFILE ARGS ~~~ */

  if (validate.profiles) {
    validateProfileArgs(
      browserArgs.length > 0 ? browserArgs : defaultsData.browser?.[0],
    );
  }

  /* ~~~ VALIDATE PORT ARGS ~~~ */

  if (portArgs.length > 0) {
    if (portArgs.some((port) => Number.isNaN(port))) {
      addMessage(
        logger.level.error(`${italic('--port')} option must be a number`),
      );
    }

    if (siteArgs.length === 0 && !urlArgs)
      addMessage(
        logger.level.error(
          `${italic('--port')} option must be used with --engine or URL`,
        ),
      );
  }

  return errorMessages.sort((a, b) => a.localeCompare(b));
}
