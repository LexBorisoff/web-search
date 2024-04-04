/**
 * Return the protocol with :// or an empty string
 * if the string has no protocol
 */
export function extractProtocol(url: string): string | null {
  const protocol = 'http';
  const postfix = '://';
  return url.startsWith(protocol) && url.includes(postfix)
    ? url.substring(0, url.indexOf(postfix) + postfix.length)
    : null;
}
