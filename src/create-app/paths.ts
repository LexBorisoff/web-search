import os from 'node:os';
import path from 'node:path';

import { APP_NAME, PACKAGE_NAMESPACE } from '../constants.js';

class Paths {
  get namespace(): string {
    return path.join(os.homedir(), `.${PACKAGE_NAMESPACE}`);
  }

  get root(): string {
    return path.join(this.namespace, APP_NAME);
  }

  get bin(): string {
    return path.join(this.root, 'bin');
  }

  get lib(): string {
    return path.join(this.root, 'lib');
  }

  get distLink(): string {
    return path.join(this.root, '.dist');
  }

  get main(): string {
    return path.join(this.distLink, 'main.js');
  }
}

export const paths = new Paths();
