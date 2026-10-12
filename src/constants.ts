import os from 'node:os';

import { getPackageInfo } from '@utils/get-package-info.js';

import type { ConfigOption } from '@app-types/config.types.js';

const NODE_ENV = process.env.NODE_ENV;

export const PACKAGE_NAME = getPackageInfo().name!;
export const PACKAGE_NAMESPACE = PACKAGE_NAME.split('/')[0].substring(1);
export const APP_NAME = PACKAGE_NAME.split('/')[1];

export const IS_WINDOWS = os.platform() === 'win32';
export const IS_DEV = NODE_ENV === 'development' || NODE_ENV === 'dev';

export const DATA_FILE = 'data.json' as const;
export const CONFIG_FILE = (option: ConfigOption): string => `${option}.yml`;
export const BASE_SCHEMA_FILE = 'base.json' as const;
export const SITES_SCHEMA_FILE = 'sites.json' as const;
export const BROWSERS_SCHEMA_FILE = 'browsers.json' as const;

export const COMMAND_FALLBACK = 'web';
export const VS_CODE = 'code';
