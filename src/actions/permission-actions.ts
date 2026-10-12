import { FileTree } from '@lexjs/filetree';
import { $, ExecaError } from 'execa';

import { logger } from '../utils/logger.js';

const dirActions = FileTree.dirActions((targetDir) => ({
  async x(fileName) {
    const currentPath = process.cwd();
    process.chdir(targetDir.path);

    try {
      await $`chmod +x ${fileName}`;
    } catch (error) {
      if (error instanceof Error || error instanceof ExecaError) {
        logger.error(error.message);
      }
    }

    process.chdir(currentPath);
  },
}));

export const permissionActions = {
  dir: dirActions,
} as const;
