const leadingSlash = /^\//;

export function removeLeadingSlash(value: string): string {
  return leadingSlash.test(value) ? value.substring(1) : value;
}
