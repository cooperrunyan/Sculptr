import { fs, path } from '../../../deps.ts';

export default async function (src: string) {
  const promises: Promise<void>[] = [];

  const res = await (async () => {
    if (src.startsWith('file:/')) {
      const p = import.meta.url.replace('src/commands/build/utils/copy.ts', '').replace('file://', '') + 'assets/out' + src.split('/assets/out')[1];
      return await Deno.readTextFile(p);
    } else return await Deno.readTextFile(src);
  })();

  const files = JSON.parse(res);

  Object.keys(files).forEach(async (key: string) => {
    const segments = key.split('/');

    //////////////////////////////////////////

    if (segments[0] && segments[0] !== segments.at(-1)) fs.ensureDirSync(path.resolve(`./${segments[0]}`));
    if (segments[1] && segments[1] !== segments.at(-1)) fs.ensureDirSync(path.resolve(`./${segments[0]}`, segments[1]));
    if (segments[2] && segments[2] !== segments.at(-1)) fs.ensureDirSync(path.resolve(`./${segments[0]}`, segments[1], segments[2]));
    if (segments[3] && segments[3] !== segments.at(-1)) fs.ensureDirSync(path.resolve(`./${segments[0]}`, segments[1], segments[2], segments[3]));
    if (segments[4] && segments[4] !== segments.at(-1)) fs.ensureDirSync(path.resolve(`./${segments[0]}`, segments[1], segments[2], segments[3], segments[4]));

    // Create directories if they arent already
    //////////////////////////////////////////

    if (/.png$|.ico$|.jpg$|.jpeg$/.test(key)) {
      const res = await Deno.readFile(import.meta.url.replace('src/commands/build/utils/copy.ts', '').replace('file://', '') + files[key]);
      const promise = Deno.writeFile('.' + key, res);
      promises.push(promise);
    } else {
      fs.ensureDir('.' + path.resolve('.', key.split('/').slice(0, -1).join('/') || '/'));
      const promise = Deno.writeTextFile(path.resolve('./' + key), files[key]);
      promises.push(promise);
    }
  });

  return Promise.all(promises);
}
