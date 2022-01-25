import { fs, path } from '../../deps.ts';

export function changeCWD(dir: string) {
  /////////////////////////////////////////
  // Change working directory
  fs.ensureDirSync(path.resolve(dir));
  Deno.chdir(path.resolve(dir));

  return;
  /////////////////////////////////////////
}
