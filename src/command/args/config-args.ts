import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getPackageInfo } from '@utils/get-package-info.js';

import { ConfigOptions as Options } from '../options.js';

const version = getPackageInfo().version!;

export const configArgs = yargs(hideBin(process.argv))
  .option(Options.Config, {
    type: 'boolean',
  })
  .help(false)
  .version(version)
  .parseSync();
