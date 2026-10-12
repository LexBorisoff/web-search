import { useCoreActions } from '@actions/core-actions.js';

import { COMMAND_FALLBACK, DATA_FILE } from '../constants.js';

export interface AppDataInterface {
  /**
   * Executable script name
   */
  command: string;
  editor?: string;
}

const defaultAppData: AppDataInterface = {
  command: COMMAND_FALLBACK,
};

const dataFile = useCoreActions((root) => root[DATA_FILE]);
const dataRaw = dataFile.read();

export const appData = dataRaw != null ? JSON.parse(dataRaw) : defaultAppData;

export function writeAppData(payload: Partial<AppDataInterface>): void {
  const newData: AppDataInterface = { ...appData, ...payload };
  dataFile.write(JSON.stringify(newData));
}
