import { fs, path } from '../../../deps.ts';
import { base } from '../../../base.ts';

export const getFiles = async (src: string) => (await fetch(src)).json();

export async function copy(src: string) {
  fs.ensureDir('.');

  const files = await getFiles(src);
  const promises: Promise<any>[] = [];

  Object.keys(files).forEach(async (key: string) => {
    await fs.ensureFile('.' + key);

    if (/.png$|.ico$|.jpg$|.jpeg$/.test(key))
      promises.push(Deno.writeFile('.' + key, new Uint8Array(await (await fetch(new URL(base + files[key]))).arrayBuffer())));
    else promises.push(Deno.writeTextFile(path.resolve('./' + key), files[key]));
  });

  return Promise.all(promises);
}
