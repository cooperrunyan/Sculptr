import * as fs from 'https://deno.land/std/node/fs.ts';
import * as path from 'https://deno.land/std/path/mod.ts';
import * as process from 'https://deno.land/std/node/process.ts';

export default function changeCWD(dir: string) {
  /////////////////////////////////////////
  // Change working directory
  fs.mkdirSync(path.resolve(dir), { recursive: true });
  process.chdir(path.resolve(dir));

  return;
  /////////////////////////////////////////
}
