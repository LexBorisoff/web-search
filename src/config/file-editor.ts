import $_ from '@lexjs/prompts';

import { writeAppData } from '@data/app-data.js';

import { VS_CODE } from '../constants.js';

export async function updateFileEditor(): Promise<string | undefined> {
  const { useVsCode } = await $_.confirm({
    name: 'useVsCode',
    message: 'Use VSCode to edit config?',
    initial: true,
  });

  if (useVsCode == null) return undefined;

  if (useVsCode) {
    writeAppData({ editor: VS_CODE });
    return VS_CODE;
  }

  const { editor } = await $_.text({
    name: 'editor',
    message: 'Command to launch file editor',
    validate: (value) => value !== '',
  });

  if (editor != null && editor !== '') {
    writeAppData({ editor });
    return editor;
  }

  return undefined;
}
