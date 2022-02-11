import { base } from '../../../base.ts';

export async function getFileJson(originFile: string, file: string): Promise<string | { [key: string]: any }> {
  return base.startsWith('file://')
    ? JSON.parse(Deno.readTextFileSync(`${base.replace('file://', '')}/assets/out/files/license/${originFile}`))[file]
    : await (
        await ((await fetch(`${base}/assets/out/files/license/${originFile}`)) as any).json()
      )[file];
}

export async function getAll(originFile: string): Promise<{ [key: string]: any }> {
  return base.startsWith('file://')
    ? JSON.parse(Deno.readTextFileSync(`${base.replace('file://', '')}/assets/out/files/license/${originFile}`))
    : await ((await fetch(`${base}/assets/out/files/license/${originFile}`)) as any).json();
}
