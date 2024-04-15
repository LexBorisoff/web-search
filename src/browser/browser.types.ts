interface StringObject {
  [key: string]: string | StringObject;
}

export type BrowserName = string | undefined;

export interface ProfilesObject {
  [key: string]: string | StringObject;
}

export type ProfilesConfig = ProfilesObject | undefined;

export interface BrowserConfig<P extends ProfilesConfig = undefined> {
  profiles: P;
}

export type ProfileGetterFn<P extends ProfilesConfig> = (
  profilesConfig: P,
) => string | string[];

export interface OpenMethodOptions<
  N extends BrowserName,
  P extends ProfilesConfig,
> {
  profile?: string | string[] | ProfileGetterFn<P>;
  /**
   * If browser name is not provided, `incognito` cannot be true
   */
  incognito?: N extends undefined ? false : boolean;
}
