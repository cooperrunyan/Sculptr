import { chalk } from '../../deps.ts';
import { exec } from './utils/exec.ts';

export async function install(shouldInstall: boolean) {
  if (!shouldInstall) return;

  let time = Date.now();

  await Deno.stdout.write(enc('  Installing dependencies (0.0s)\n'));

  async function refresh() {
    await clearLastLine();
    await Deno.stdout.write(enc(`  Installing dependencies (${((Date.now() - time) / 1000).toFixed(1)}s)\n`));
  }
  const int = setInterval(refresh, 10);

  await exec('npm i');
  clearInterval(int);
  await clearLastLine();
  await Deno.stdout.write(enc(chalk.blue(`  Installed dependencies (${((Date.now() - time) / 1000).toFixed(2)}s)\n`)));
}

const enc = (str: string) => new TextEncoder().encode(str);

const clearLastLine = () => {
  return Deno.stdout.write(enc('\x1b[A\x1b[K')); // clears from cursor to line end
};
