import { enc } from '../utils/enc.ts';

export const clearLastLine = () => {
  return Deno.stdout.write(enc('\x1b[A\x1b[K')); // clears from cursor to line end
};

export { enc };
