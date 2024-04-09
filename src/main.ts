import open, { openApp, apps } from 'open';
import { Browser } from './browser.js';
import { Urls } from './urls.js';

type BrowserType = Browser | string;

export default class BrowserSearch extends Urls {
  /**
   * Opens the constructed URLs, if any, in the
   * provided browser(s) or the default system browser
   */
  public openBrowsers(...browsers: BrowserType[]): this {
    // browser(s) provided in args
    if (browsers.length > 0) {
      browsers.forEach((item) => {
        this.openBrowser(item);
      });

      return this;
    }

    // no browser but has urls
    if (this.urls.length > 0) {
      this.urls.forEach((url) => {
        open(url);
      });
    }

    return this;
  }

  private openBrowser(browser: Browser | string) {
    const browserName =
      typeof browser === 'string' ? browser : browser.browserName;
    const browserAppName = this.getBrowserAppName(browserName);

    let profiles: string[] = [];
    const [profileDirectory, incognito] =
      typeof browser === 'string'
        ? [null, this.incognito]
        : [
            browser.browserOptions.profileDirectory,
            browser.browserOptions.incognito ?? this.incognito,
          ];

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
            incognito,
            directory,
          );

          handler(browserArguments);
        });
      } else {
        const browserArguments = this.getBrowserArguments(
          browserName,
          incognito,
          null,
        );
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
    browserName: string,
    incognito: boolean,
    profileDirectory: string | null = null,
  ) {
    const browserArguments: string[] = [];

    if (profileDirectory != null) {
      browserArguments.push(`--profile-directory=${profileDirectory}`);
    }

    if (incognito) {
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
