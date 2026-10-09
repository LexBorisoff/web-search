import path from 'node:path';

import $_ from '@lexjs/prompts';
import { openApp } from 'open';

import { useCoreActions } from '@actions/core-actions.js';
import { appData, writeAppData } from '@data/app-data.js';
import { logger } from '@utils/logger.js';
import { yamlFiles } from '@utils/yaml-files.js';

import { CONFIG_FILE } from '../constants.js';

import { updateFileEditor } from './file-editor.js';

import type { ConfigOption } from '@app-types/config.types.js';
import type { Choice } from '@lexjs/prompts/lib';

const configChoices: Choice<ConfigOption>[] = [
  { title: 'Sites', value: 'sites' },
  { title: 'Browsers', value: 'browsers' },
];

function normalizeChoiceArg(arg?: string): ConfigOption | undefined {
  const configOptions: ConfigOption[] = ['browsers', 'sites'];
  return configOptions.find((option) => arg != null && option.startsWith(arg));
}

const configDir = useCoreActions(({ config }) => config);

export function configFileExists(option: ConfigOption): boolean {
  const configName = CONFIG_FILE(option);
  return !!yamlFiles(configName).find((file) => configDir.exists(file));
}

export function getConfigFileName(option: ConfigOption): string {
  const configName = CONFIG_FILE(option);
  return (
    yamlFiles(configName).find((file) => configDir.exists(file)) ?? configName
  );
}

export function getConfigFilePath(option: ConfigOption): string {
  const configName = getConfigFileName(option);
  return path.join(configDir.getPath(), configName);
}

export function createInitialConfig(option: ConfigOption): void {
  const configName = getConfigFileName(option);
  configDir.writeFile(
    configName,
    `$schema: ../schema/${option}.json

`,
  );
}

export async function openConfigFile(arg?: string): Promise<void> {
  const editor = appData.editor ?? (await updateFileEditor());

  if (editor == null) return;

  const choiceArg = normalizeChoiceArg(arg);
  const isConfigChoice = choiceArg === 'sites' || choiceArg === 'browsers';

  let configOption: ConfigOption | undefined = isConfigChoice
    ? choiceArg
    : undefined;

  if (choiceArg == null || !isConfigChoice) {
    const { selectedConfig } = await $_.select({
      name: 'selectedConfig',
      message: 'Select config to edit',
      choices: configChoices,
    });
    configOption = selectedConfig;
  }

  if (configOption == null) return;

  if (!configFileExists(configOption)) {
    createInitialConfig(configOption);
  }

  const subprocess = await openApp(editor, {
    arguments: [getConfigFilePath(configOption)],
  });

  subprocess.on('error', () => {
    writeAppData({ editor: undefined });
    logger.error('Error opening file editor:', editor);
  });
}
