import * as fs from 'https://deno.land/std@0.95.0/fs/mod.ts';
import * as path from 'https://deno.land/std@0.120.0/path/mod.ts';

export default function changeCWD(dir: string) {
  /////////////////////////////////////////
  // Change working directory
  fs.ensureDirSync(path.resolve(dir));
  Deno.chdir(path.resolve(dir));

  return;
  /////////////////////////////////////////
}
