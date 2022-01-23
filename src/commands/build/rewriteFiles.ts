import { chalk, path } from '../../deps.ts';

import type Configuration from './types/Configuration.ts';
import exec from './utils/exec.ts';
import add from '../add/index.ts';

const enc = (str: string) => new TextEncoder().encode(str);

const clearLastLine = () => {
  return Deno.stdout.write(enc('\x1b[A\x1b[K')); // clears from cursor to line end
};

export async function writePackage(options: Configuration, username: string) {
  let time = Date.now();
  Deno.stdout.writeSync(enc('  Writing package.json (0.00s)\n'));

  async function refresh() {
    await clearLastLine();
    await Deno.stdout.write(enc(`  Writing package.json (${((Date.now() - time) / 1000).toFixed(1)}s)\n`));
  }

  const int = setInterval(refresh, 100);

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

export default async function rewriteFiles(options: Configuration, username: string, projectName: string, newPackageFile: object) {
  const promises: Promise<void>[] = [];
  // gitignore
  promises.push(Deno.writeTextFile(path.resolve('./.gitignore'), 'node_modules\n'));

  // license
  promises.push(add.license({ log: false, noOutput: true }, 'mit'));

  // tsconfig
  promises.push(add.tsconfig({ strict: true, [options.platform]: true, overwrite: true, noOutput: true }));

  // README.md
  promises.push(Deno.writeTextFile(path.resolve('./README.md'), `# ${projectName} \n\n###### - ${username}`));

  // homepage
  const extension = options.script === 'typescript' ? '.tsx' : '.jsx';
  const hpDir = options.platform === 'next' ? path.resolve('pages/index' + extension) : options.platform === 'react' ? path.resolve('src/App' + extension) : '';

  const script = Deno.readTextFileSync(hpDir)
    .replaceAll('PROJECT-NAME', projectName)
    .replaceAll('SCRIPT', options.script)
    .replaceAll('PLATFORM', options.platform)
    .replaceAll('STYLE', options.style);

  promises.push(Deno.writeTextFile(hpDir, script));

  await Promise.all(promises);

  return newPackageFile;
  /////////////////////////////////////////
}
