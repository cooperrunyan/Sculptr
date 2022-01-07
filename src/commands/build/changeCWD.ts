import * as fs from 'https://deno.land/std@0.95.0/fs/mod.ts';
import * as path from 'https://deno.land/std@0.120.0/path/mod.ts';
import * as process from 'https://deno.land/std/node/process.ts';

export default function changeCWD(dir: string) {
  /////////////////////////////////////////
  // Change working directory
  fs.ensureDirSync(path.resolve(dir));
  process.chdir(path.resolve(dir));

  return;
  /////////////////////////////////////////
}
