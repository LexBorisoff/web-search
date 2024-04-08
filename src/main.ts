import open, { openApp, apps } from 'open';
import { Browser } from './browser.js';
import { Urls } from './urls.js';

type BrowserType = Browser | string;

export default class BrowserSearch extends Urls {
  /**
   * Opens the constructed search query/queries, if any,
   * in the provided browser or the default system browser
   */
  public openBrowser(browser?: BrowserType | BrowserType[]): void {
    let browserList: (Browser | string)[] = [];
    if (browser != null) {
      browserList = Array.isArray(browser) ? browser : [browser];
    }

    // browser(s) provided in args
    if (browserList.length > 0) {
      browserList.forEach((item) => {
        this.__openBrowser(item);
      });

      return;
    }

    // no browser but has urls
    if (this.urls.length > 0) {
      this.urls.forEach((url) => {
        open(url);
      });
    }
  }

  private __openBrowser(browser: Browser | string) {
    const browserName = typeof browser === 'string' ? browser : browser.name;
    const browserAppName = this.getBrowserAppName(browserName);
    let profiles: string[] = [];

    const profileDirectory =
      typeof browser === 'string' ? null : browser.profileDirectory;

    if (profileDirectory != null) {
      profiles = Array.isArray(profileDirectory)
        ? profileDirectory
        : [profileDirectory];
    }

    const handleOpen = (handler: (browserArguments: string[]) => void) => {
      if (profiles.length > 0) {
        profiles.forEach((directory) => {
          const browserArguments = this.getBrowserArguments(
            browserName,
            directory,
          );

          handler(browserArguments);
        });
      } else {
        const browserArguments = this.getBrowserArguments(browserName, null);
        handler(browserArguments);
      }
    };

    // open Urls
    if (this.urls.length > 0) {
      this.urls.forEach((url) => {
        handleOpen((browserArguments) => {
          open(url, {
            app: {
              name: browserAppName,
              arguments: browserArguments,
            },
          });
        });
      });
    }
    // open empty browser
    else {
      handleOpen((browserArguments) => {
        openApp(browserAppName, {
          arguments: browserArguments,
        });
      });
    }
  }

  private getBrowserAppName(browserName: string) {
    switch (browserName.toLowerCase()) {
      case 'chrome':
        return apps.chrome;
      case 'firefox':
        return apps.firefox;
      case 'edge':
        return apps.edge;
      default:
        return browserName;
    }
  }

  private getBrowserArguments(
    browserName?: string,
    profileDirectory: string | null = null,
  ) {
    const browserArguments: string[] = [];

    if (profileDirectory != null) {
      browserArguments.push(`--profile-directory=${profileDirectory}`);
    }

    if (this.incognito) {
      let incognitoValue = 'incognito';

      if (browserName === 'edge') {
        incognitoValue = 'inprivate';
      } else if (browserName === 'firefox' || browserName === 'opera') {
        incognitoValue = 'private';
      }

      browserArguments.push(`--${incognitoValue}`);
    }

    return browserArguments;
  }
}
