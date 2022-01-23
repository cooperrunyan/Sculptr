import { chalk } from '../../deps.ts';
import type BuildArgs from './types/BuildArgs.ts';
import exec from './utils/exec.ts';

export default async function install(args: BuildArgs) {
  if (args.booleanOptions.skip === true) return;

  let time = Date.now();

  await Deno.stdout.write(enc('  Installing dependencies (0.0s)\n'));

  async function refresh() {
    await clearLastLine();
    await Deno.stdout.write(enc(`  Installing dependencies (${((Date.now() - time) / 1000).toFixed(1)}s)\n`));
  }
  const int = setInterval(refresh, 100);

  await exec('npm i');
  clearInterval(int);
  await clearLastLine();
  await Deno.stdout.write(enc(chalk.blue(`  Installed dependencies (${((Date.now() - time) / 1000).toFixed(2)}s)\n`)));
}

const enc = (str: string) => new TextEncoder().encode(str);

const clearLastLine = () => {
  return Deno.stdout.write(enc('\x1b[A\x1b[K')); // clears from cursor to line end
};
