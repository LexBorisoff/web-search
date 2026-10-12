import {
  BASE_SCHEMA_FILE,
  BROWSERS_SCHEMA_FILE,
  DATA_FILE,
  PACKAGE_NAME,
  SITES_SCHEMA_FILE,
} from '../constants.js';

import baseSchema from './schema/base.json' with { type: 'json' };
import browsersSchema from './schema/browsers.json' with { type: 'json' };
import sitesSchema from './schema/sites.json' with { type: 'json' };

import type { TreeInterface } from '@lexjs/filetree';

export const initialTree = {
  bin: {},
  lib: {},
  config: {},
  schema: {
    [BASE_SCHEMA_FILE]: JSON.stringify(baseSchema, null, 2),
    [SITES_SCHEMA_FILE]: JSON.stringify(sitesSchema, null, 2),
    [BROWSERS_SCHEMA_FILE]: JSON.stringify(browsersSchema, null, 2),
  },
} satisfies TreeInterface;

export const tree = {
  ...initialTree,
  [DATA_FILE]: '',
  lib: {
    node_modules: {
      [PACKAGE_NAME]: {
        dist: {},
      },
    },
  },
} satisfies TreeInterface;
