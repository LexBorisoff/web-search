/**
 * Return a string without https:// or http://
 */
export function removeProtocol(url: string): string {
  return url.startsWith('https://') || url.startsWith('http://')
    ? url.split('://')[1]
    : url;
}
