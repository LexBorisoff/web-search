export type BrowserName = string | undefined;

export interface ProfilesObject {
  [key: string]: string | ProfilesObject;
}

export type ProfilesConfig = ProfilesObject | undefined;

export interface BrowserConfig<
  N extends BrowserName = undefined,
  P extends ProfilesConfig = undefined,
> {
  profiles?: N extends undefined ? undefined : P;
}

export type ProfileGetterFn<P extends ProfilesConfig> = (
  profilesConfig: P,
) => string | string[];

export interface OpenMethodOptions<
  N extends BrowserName,
  P extends ProfilesConfig,
> {
  /**
   * If browser name is not provided, `profile` cannot be defined
   */
  profile?: N extends undefined
    ? undefined
    : string | string[] | ProfileGetterFn<P>;
  /**
   * If browser name is not provided, `incognito` cannot be defined
   */
  incognito?: N extends undefined ? undefined : boolean;
}
