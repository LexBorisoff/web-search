export function title(text: string): string {
  return `${text[0].toUpperCase()}${text.substring(1).toLowerCase()}`;
}

export function capitalize(text: string, delimiter = ' '): string {
  const tokens = text.split(delimiter);
  return tokens.map((token) => title(token)).join(delimiter);
}
