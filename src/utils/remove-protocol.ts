/**
 * Return a string without https:// or http://
 */
export function removeProtocol(url: string): string {
  return url.startsWith('http') && url.includes('://')
    ? url.split('://')[1]
    : url;
}
