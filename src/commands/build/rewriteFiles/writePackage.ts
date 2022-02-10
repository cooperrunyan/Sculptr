import { chalk, path } from '../../../deps.ts';
import { Configuration } from '../../../types/index.ts';
import { exec } from '../utils/exec.ts';
import { enc, clearLastLine } from './utils.ts';

export async function writePackage(options: Configuration, username: string) {
  let time = Date.now();
  Deno.stdout.writeSync(enc('  Writing package.json (0.00s)\n'));

  async function refresh() {
    await clearLastLine();
    await Deno.stdout.write(enc(`  Writing package.json (${((Date.now() - time) / 1000).toFixed(1)}s)\n`));
  }

  const int = setInterval(refresh, 10);

  const oldPackage = JSON.parse(Deno.readTextFileSync(path.resolve('./package.json')));
  Deno.removeSync(path.resolve('./package.json'));
  await exec('npm init -y');
  const newPackageFile = JSON.parse(Deno.readTextFileSync(path.resolve('./package.json')));

  newPackageFile.main = oldPackage.main;
  newPackageFile.author = username;
  newPackageFile.scripts = oldPackage.scripts;
  newPackageFile.dependencies = oldPackage.dependencies;
  newPackageFile.devDependencies = oldPackage.devDependencies;
  newPackageFile.version = '0.0.0';
  newPackageFile.license = 'MIT';

  if (options.platform === 'next' || options.platform === 'react')
    newPackageFile.browserslist = {
      production: ['>0.2%', 'not dead', 'not op_mini all'],
      development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
    };

  await Deno.writeTextFile(path.resolve('./package.json'), JSON.stringify(newPackageFile, null, 2));
  clearInterval(int);

  await clearLastLine();
  await Deno.stdout.write(enc(chalk.blue(`  Wrote package.json (${((Date.now() - time) / 1000).toFixed(3)}s)\n`)));
  return newPackageFile;
}
