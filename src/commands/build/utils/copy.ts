import { readerFromStreamReader } from 'https://deno.land/std@0.104.0/io/streams.ts';
import { chalk, fs, path } from '../../../deps.ts';
import { root } from '../../../root.ts';

const enc = (str: string) => new TextEncoder().encode(str);

const clearLastLine = () => {
  return Deno.stdout.write(enc('\x1b[A\x1b[K')); // clears from cursor to line end
};

async function getFiles(src: string) {
  const res = await (async () => {
    if (!src.startsWith('http')) {
      const p = import.meta.url.replace('src/commands/build/utils/copy.ts', '').replace('file://', '') + 'assets/out' + src.split('/assets/out')[1];
      return JSON.parse(await Deno.readTextFile(p));
    } else return await (await fetch(src)).json();
  })();

  return res;
}

export async function packageJson(src: string) {
  const files = await getFiles(src);
  fs.ensureDir('.');
  return await Deno.writeTextFile(path.resolve('./package.json'), files['/package.json']);
}

export async function copy(src: string) {
  const startTime = Date.now();
  await Deno.stdout.write(enc(`  Writing files 0/0 (0.000s)\n`));

  let time = Date.now();
  let total = 0;
  const int = setInterval(refresh, 10);

  let i = 0;

  const files = await getFiles(src);
  total = Object.keys(files).length - 1;

  async function refresh() {
    await clearLastLine();
    await Deno.stdout.write(enc(`  Writing files ${i}/${total} (${((Date.now() - time) / 1000).toFixed(2)}s)\n`));
  }

  Object.keys(files).forEach(async (key: string) => {
    if (/package\.json/.test(key)) return;

    fs.ensureFileSync('.' + key);

    i++;

    if (/.png$|.ico$|.jpg$|.jpeg$/.test(key)) {
      const res = await (async () => {
        if (!src.startsWith('http')) {
          const res = await Deno.readFile(import.meta.url.replace('src/commands/build/utils/copy.ts', '').replace('file://', '') + files[key]);
          Deno.writeFileSync('.' + key, res);
        } else {
          console.log(root + ((await (await fetch(src)).json())[key] as any));
          const rsp = await fetch(root + (await (await fetch(src)).json())[key]);
          const rdr = rsp.body?.getReader();
          if (rdr) {
            const r = readerFromStreamReader(rdr);
            const f = await Deno.open('.' + key, { create: true, write: true });
            await Deno.copy(r, f);
            f.close();
          }
        }
      })();
    } else {
      fs.ensureDir('.' + path.resolve('.', key.split('/').slice(0, -1).join('/') || '/'));
      Deno.writeTextFileSync(path.resolve('./' + key), files[key]);
    }
  });

  clearInterval(int);
  await clearLastLine();
  await Deno.stdout.write(enc(chalk.blue(`  Wrote files ${i}/${total} (${((Date.now() - startTime) / 1000).toFixed(3)}s)\n`)));
}
