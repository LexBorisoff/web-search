import type {
  SiteConfig,
  ResourceConfig,
  QueryPathConfig,
} from '@api/site/site.types.js';

export type ConfigOption = 'sites' | 'browsers';

export interface WithAlias {
  alias?: string | string[];
}

export interface WithDefault {
  default?: boolean;
}

export interface BaseConfigOptions extends WithAlias, WithDefault {}

/* ~~~ SITES ~~~ */

export interface ConfigSiteOptions<
  S extends QueryPathConfig = undefined,
  R extends ResourceConfig = undefined,
>
  extends SiteConfig<S, R>, BaseConfigOptions {}

export interface ConfigSite extends ConfigSiteOptions<
  QueryPathConfig,
  ResourceConfig
> {
  url: string;
}

/* ~~~ BROWSERS ~~~ */

export interface Profile extends BaseConfigOptions {
  directory: string;
}

export interface ConfigProfiles {
  [key: string]: string | Profile;
}

export type ProfilesData = {
  [K in keyof ConfigProfiles]: Exclude<ConfigProfiles[K], string>;
};

export interface ConfigBrowserOptions extends BaseConfigOptions {
  appPath?: string;
  profiles?: ConfigProfiles;
}

export type ConfigBrowser = ConfigBrowserOptions;

/* ~~~ CONFIG DATA ~~~ */

export interface WithSchema {
  $schema: string;
}

export type SitesData = Record<string, ConfigSite>;
export type BrowsersData = Record<string, ConfigBrowser>;

export type SitesConfig = SitesData & WithSchema;
export type BrowsersConfig = BrowsersData & WithSchema;

export interface ConfigData {
  sites: SitesData;
  browsers: BrowsersData;
}

/* ~~~ DEFAULTS ~~~ */

export interface DefaultsData {
  delimiter: string;
  site: [string, ConfigSite];
  browser: [string, ConfigBrowser] | null;
  profile: (browserName: string) => [string, Profile] | null;
}
