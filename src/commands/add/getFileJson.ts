import { root } from '../../root.ts';

export default async function getFileJson(originFile: string, file: string): Promise<string | { [key: string]: any }> {
  return root.startsWith('file://')
    ? JSON.parse(Deno.readTextFileSync(`${root.replace('file://', '')}/assets/out/files/license/${originFile}`))[file]
    : await (
        await ((await fetch(`${root}/assets/out/files/license/${originFile}`)) as any).json()
      )[file];
}

export async function getAll(originFile: string): Promise<{ [key: string]: any }> {
  return root.startsWith('file://')
    ? JSON.parse(Deno.readTextFileSync(`${root.replace('file://', '')}/assets/out/files/license/${originFile}`))
    : await ((await fetch(`${root}/assets/out/files/license/${originFile}`)) as any).json();
}
