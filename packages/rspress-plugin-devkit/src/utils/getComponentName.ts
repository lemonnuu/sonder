import path from 'node:path';

export function getComponentName(componentPath: string): string {
  return path.basename(componentPath, path.extname(componentPath));
}
