import { root } from '../../root.ts';

export default async function getFileJson(file: string): Promise<{ [key: string]: string }> {
  return root.startsWith('file://')
    ? JSON.parse(Deno.readTextFileSync(`${root.replace('file://', '')}/assets/out/files/license/license.json`))[file]
    : await ((await fetch(`${root}/assets/out/files/license/license.json`)) as any).json()[file];
}
