#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

import $_ from '@lexjs/prompts';
import chalk from 'chalk';
import { createTree, FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { appData } from '@data/app-data.js';
import { npmCommands, npmHooks } from '@hooks/npm.hooks.js';
import { permissionHooks } from '@hooks/permission.hooks.js';
import { getPackageJson } from '@utils/get-package-json.js';
import { logger } from '@utils/logger.js';

import {
  configFileExists,
  createInitialConfig,
} from '../config/config-file.js';
import {
  DATA_FILE,
  IS_DEV,
  IS_WINDOWS,
  PACKAGE_NAME,
  COMMAND_FALLBACK,
} from '../constants.js';
import { useCoreHooks } from '../hooks/core.hooks.js';

import { paths } from './paths.js';
import {
  bashScript,
  bashStartScript,
  powershellScript,
} from './script-contents.js';
import { initialTree, tree } from './tree.js';

import type { ConfigOption } from '@app-types/config.types.js';

function isEmpty(str: string | undefined): str is undefined | '' {
  return str == null || str === '';
}

async function getCommand(): Promise<string | undefined> {
  let command: string | undefined;
  const rootDir = useCoreHooks((root) => root);

  if (rootDir.exists(DATA_FILE)) {
    command = appData.command;
  }

  let renameCommand = false;
  if (!isEmpty(command)) {
    logger.warning(
      `${PACKAGE_NAME} command is set as ${chalk.underline(command)}\n`,
    );

    const { rename } = await $_.toggle({
      message: 'Do you want to rename it?',
      name: 'rename',
    });

    if (rename == null) return undefined;
    renameCommand = rename;
  }

  if (isEmpty(command) || renameCommand) {
    const { commandName } = await $_.text({
      name: 'commandName',
      message: 'What should be the command name?',
      initial: COMMAND_FALLBACK,
    });

    if (commandName == null) return undefined;
    command = commandName;
  }

  return command;
}

async function initializeApp(command: string): Promise<void> {
  const fsHooks = new FsHooks(paths.root, initialTree);
  createTree(fsHooks);

  // create data and config files
  const useCore = fsHooks.useHooks(coreHooks);
  const rootDir = useCore((root) => root);
  rootDir.fileCreate(DATA_FILE, JSON.stringify({ ...appData, command }));

  const configOptions: ConfigOption[] = ['browsers', 'sites'];
  configOptions.forEach((option) => {
    if (!configFileExists(option)) {
      createInitialConfig(option);
    }
  });

  // install package (link in development)
  const version = IS_DEV ? '' : getPackageJson().version;
  const pkg =
    version != null && version !== ''
      ? `${PACKAGE_NAME}@${version}`
      : PACKAGE_NAME;

  const npmCommand = IS_DEV ? npmCommands.link : npmCommands.install;
  const useNpm = fsHooks.useHooks(npmHooks);
  await useNpm(({ lib }) => lib)[npmCommand]([pkg]);
}

function linkDist(): void {
  const distDir = useCoreHooks(
    ({ lib }) => lib.node_modules[PACKAGE_NAME].dist,
  ).getPath();

  if (fs.existsSync(paths.distLink)) {
    fs.rmSync(paths.distLink, { force: true, recursive: true });
  }

  fs.symlinkSync(distDir, paths.distLink, IS_WINDOWS ? 'junction' : 'dir');
}

async function createScriptFiles(command: string): Promise<void> {
  const rootDir = useCoreHooks((root) => root);
  const binDir = useCoreHooks((root) => root.bin);
  const scriptNames = { bash: command, powershell: `${command}.ps1` };
  const { bash, powershell } = scriptNames;

  // delete files that are not named based on the command
  const binFiles = fs.readdirSync(binDir.getPath());
  binFiles
    .filter((file) => {
      const filePath = path.join(binDir.getPath(), file);
      const isCommandFile = Object.values(scriptNames).includes(file);
      return fs.statSync(filePath).isFile() && !isCommandFile;
    })
    .forEach((file) => {
      binDir.fileDelete(file);
    });

  const fsHooks = new FsHooks(paths.root, tree);
  const usePermissions = fsHooks.useHooks(permissionHooks);
  const binPermissions = usePermissions(({ bin }) => bin);

  // create script files
  rootDir.fileCreate('start.sh', bashStartScript);
  binDir.fileCreate(bash, bashScript);
  await binPermissions.x(bash);

  if (IS_WINDOWS) {
    binDir.fileCreate(powershell, powershellScript);
    await binPermissions.x(bash);
  }
}

(async function createApp(): Promise<void> {
  const command = await getCommand();
  if (command == null) return;

  await initializeApp(command);
  await createScriptFiles(command);
  linkDist();
})();
