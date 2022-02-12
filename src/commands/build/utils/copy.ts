import { readerFromStreamReader } from 'https://deno.land/std@0.104.0/io/streams.ts';
import { chalk, fs, path } from '../../../deps.ts';
import { base } from '../../../base.ts';

export async function getFiles(src: string) {
  const res = await (async () => {
    if (!src.startsWith('http')) {
      const p = import.meta.url.replace('src/commands/build/utils/copy.ts', '').replace('file://', '') + 'assets/out' + src.split('/assets/out')[1];
      return JSON.parse(await Deno.readTextFile(p));
    } else return await (await fetch(src)).json();
  })();

  return res;
}

export async function copy(src: string) {
  fs.ensureDir('.');

  const files = await getFiles(src);

  const promises: Promise<any>[] = [];

  Object.keys(files).forEach(async (key: string) => {
    fs.ensureFileSync('.' + key);

    if (/.png$|.ico$|.jpg$|.jpeg$/.test(key)) {
      promises.push(
        (async () => {
          if (!src.startsWith('http')) return Deno.writeFile('.' + key, await Deno.readFile(base.replace('file://', '') + '/' + files[key]));
          else {
            console.log(src);
            console.log(base + '/' + ((await (await fetch(src)).json()) as any)[key]);
            const rsp = await fetch(base + '/' + (await (await fetch(src)).json())[key]);
            const rdr = rsp.body?.getReader();
            if (rdr) {
              const r = readerFromStreamReader(rdr);
              const f = await Deno.open('.' + key, { create: true, write: true });
              return Deno.copy(r, f).then(f.close);
            }
          }
        })(),
      );
    } else {
      fs.ensureDir('.' + path.resolve('.', key.split('/').slice(0, -1).join('/') || '/'));
      promises.push(Deno.writeTextFile(path.resolve('./' + key), files[key]));
    }
  });

  await Promise.all(promises);
}
