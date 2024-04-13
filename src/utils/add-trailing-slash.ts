import { patterns } from './patterns.js';

export function addTrailingSlash(value: string): string {
  return patterns.trailingSlash.test(value) ? value : `${value}/`;
}
