import { patterns } from './patterns.js';

export function removeLeadingSlash(value: string): string {
  return patterns.leadingSlash.test(value) ? value.substring(1) : value;
}
