export function yamlFiles(fileName: string): string[] {
  const cond = fileName.endsWith('.yml');
  const ext = cond ? /.yml$/ : /.yaml$/;
  const replacer = cond ? '.yaml' : '.yml';
  return [fileName, fileName.replace(ext, replacer)];
}
