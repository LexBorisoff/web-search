/**
 * Return the protocol or an empty string
 * if the url string has no protocol
 */
export function extractProtocol(url: string): string | null {
  const delimiter = '://';
  return url.startsWith('http') && url.includes(delimiter)
    ? url.substring(0, url.indexOf(delimiter) + delimiter.length)
    : null;
}
