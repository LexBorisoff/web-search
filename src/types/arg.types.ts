import type { PrimitiveType } from './primitive.type.js';
import type {
  QueryOptions as Options,
  queryOptionTypes as types,
} from '@command/options.js';

export interface ArgTypes {
  [Options.Browser]: PrimitiveType<(typeof types)[Options.Browser]>;
  [Options.Profile]: PrimitiveType<(typeof types)[Options.Profile]>;
  [Options.Site]: PrimitiveType<(typeof types)[Options.Site]>;
  [Options.Query]: PrimitiveType<(typeof types)[Options.Query]>;
  [Options.Resource]: PrimitiveType<(typeof types)[Options.Resource]>;
  [Options.Delimiter]: PrimitiveType<(typeof types)[Options.Delimiter]>;
  [Options.Port]: PrimitiveType<(typeof types)[Options.Port]>;
  [Options.Incognito]: PrimitiveType<(typeof types)[Options.Incognito]>;
  [Options.Split]: PrimitiveType<(typeof types)[Options.Split]>;
  [Options.Http]: PrimitiveType<(typeof types)[Options.Http]>;
  [Options.DryRun]: PrimitiveType<(typeof types)[Options.DryRun]>;
}

export type ArrayArgType<Option extends Options> =
  ArgTypes[Option] | ArgTypes[Option][] | undefined;

export interface ArrayArgs {
  [Options.Browser]: ArrayArgType<Options.Browser>;
  [Options.Profile]: ArrayArgType<Options.Profile>;
  [Options.Site]: ArrayArgType<Options.Site>;
  [Options.Query]: ArrayArgType<Options.Query>;
  [Options.Resource]: ArrayArgType<Options.Resource>;
  [Options.Port]: ArrayArgType<Options.Port>;
}
