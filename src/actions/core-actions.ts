import { FileTree } from '@lexjs/filetree';
import { coreActions } from '@lexjs/filetree/actions';

import { paths } from '../create-app/paths.js';
import { tree } from '../create-app/tree.js';

const fileTree = new FileTree(paths.root, tree);

export const useCoreActions = fileTree.use(coreActions);
