import { configArgs } from '@command/args/config-args.js';

import { openConfigFile } from './config-file.js';
import { updateFileEditor } from './file-editor.js';

const _ = configArgs._.map((arg) => `${arg}`);

export async function handleConfig(): Promise<void> {
  const arg = _.at(0);

  if (arg === 'editor') {
    await updateFileEditor();
    return;
  }

  await openConfigFile(arg);
}
