import { findBrowser } from './find-browser.js';

/**
 * Returns a browser key from the config if it is found
 * by the provided name or alias, otherwise returns the argument
 */
export function getBrowserName(browserNameOrAlias: string): string {
  const [browserName] = findBrowser(browserNameOrAlias) ?? [];
  return browserName ?? browserNameOrAlias;
}
