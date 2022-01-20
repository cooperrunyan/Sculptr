import { root } from '../../root.ts';

export default async function getFileJson(originFile: string, file: string): Promise<{ [key: string]: string }> {
  return root.startsWith('file://')
    ? JSON.parse(Deno.readTextFileSync(`${root.replace('file://', '')}/assets/out/files/license/${originFile}`))[file]
    : await ((await fetch(`${root}/assets/out/files/license/${originFile}`)) as any).json()[file];
}
