const trailingSlash = /\/$/;

export function addTrailingSlash(value: string): string {
  return trailingSlash.test(value) ? value : `${value}/`;
}
