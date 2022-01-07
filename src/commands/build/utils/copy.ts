import * as fs from 'https://deno.land/std@0.95.0/fs/mod.ts';
import * as path from 'https://deno.land/std@0.120.0/path/mod.ts';
import * as streams from 'https://deno.land/std/streams/conversion.ts';

export default async function (src: string, destination: string) {
  const res = await fetch(src + '.json');
  const files = await res.json();

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
      const res = await fetch(files[key]);
      const reader = res.body?.getReader();
      if (reader) {
        const source = streams.readerFromStreamReader(reader);
        const newFile = await Deno.open('.' + key, { create: true, write: true });
        await streams.copy(source, newFile);
        newFile.close();
      }
    } else {
      Deno.writeTextFileSync(path.resolve('./' + key), files[key]);
    }
  });
}
