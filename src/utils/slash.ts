import { matchers } from '../matchers/matchers.js';

type SlashType = 'leading' | 'trailing';
type MethodName = 'add' | 'remove';
type MethodFn = (value: string) => string;
type Slash = Record<SlashType, Record<MethodName, MethodFn>>;

export const slash: Slash = {
  leading: {
    add(value) {
      return matchers.slash.leading.test(value) ? value : `/${value}`;
    },
    remove(value) {
      return matchers.slash.leading.test(value) ? value.substring(1) : value;
    },
  },
  trailing: {
    add(value) {
      return matchers.slash.trailing.test(value) ? value : `${value}/`;
    },
    remove(value) {
      return matchers.slash.trailing.test(value)
        ? value.substring(0, value.length - 1)
        : value;
    },
  },
};
