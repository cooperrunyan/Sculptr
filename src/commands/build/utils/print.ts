import { enc } from './enc.ts';
export const print = (str: string) => {
  Deno.stdout.writeSync(enc(str + '\n'));
  return;
};
