import { patterns } from './patterns.js';

type SlashType = 'leading' | 'trailing';
type MethodName = 'add' | 'remove';
type MethodFn = (value: string) => string;
type Slash = Record<SlashType, Record<MethodName, MethodFn>>;

export const slash: Slash = {
  leading: {
    add(value) {
      return patterns.slash.leading.test(value) ? value : `/${value}`;
    },
    remove(value) {
      return patterns.slash.leading.test(value) ? value.substring(1) : value;
    },
  },
  trailing: {
    add(value) {
      return patterns.slash.trailing.test(value) ? value : `${value}/`;
    },
    remove(value) {
      return patterns.slash.trailing.test(value)
        ? value.substring(0, value.length - 1)
        : value;
    },
  },
};
