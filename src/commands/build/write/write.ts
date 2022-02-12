import { chalk, path } from '../../../deps.ts';

import * as add from '../../add/index.ts';
import { Configuration } from '../../../types/index.ts';
import { exec } from '../utils/exec.ts';
import { base } from '../../../base.ts';
import { copy, getFiles } from '../utils/copy.ts';
import { sleep } from '../utils/sleep.ts';
import { print } from '../utils/print.ts';
import { clearLastLine, enc } from './utils.ts';

export async function write(options: Configuration, username: string) {
  const promises: Promise<any>[] = [];

  const startTime = Date.now();
  print(`  Writing files 0/0 (0.000s)`);

  let time = Date.now();
  let total = 0;
  const int = setInterval(refresh, 100);

  total = Object.keys(await getFiles(`${base}/assets/out/${options.platform}-template/${options.script}/${options.style}.json`)).length - 1 + 4;

  async function refresh() {
    await clearLastLine();
    print(`  Writing files (${total}) (${((Date.now() - time) / 1000).toFixed(1)}s)`);
  }

  await copy(`${base}/assets/out/${options.platform}-template/${options.script}/${options.style}.json`);

  // package
  const oldPackage = JSON.parse(Deno.readTextFileSync(path.resolve('./package.json')));
  Deno.removeSync(path.resolve('./package.json'));
  await exec('npm init -y');
  const newPackageFile = {
    ...JSON.parse(Deno.readTextFileSync(path.resolve('./package.json'))),
    main: oldPackage.main,
    author: username,
    scripts: oldPackage.scripts,
    dependencies: oldPackage.dependencies,
    devDependencies: oldPackage.devDependencies,
    version: '0.0.0',
    license: options.license || 'mit',
  };

  if (options.platform === 'next' || options.platform === 'react')
    newPackageFile.browserslist = {
      production: ['>0.2%', 'not dead', 'not op_mini all'],
      development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
    };

  promises.push(Deno.writeTextFile(path.resolve('./package.json'), JSON.stringify(newPackageFile, null, 2)));

  //////////////////

  // gitignore
  promises.push(Deno.writeTextFile(path.resolve('./.gitignore'), 'node_modules\n'));

  // license
  promises.push(add.actions.license(options.license || 'mit'));

  // tsconfig
  promises.push(add.actions.tsconfig({ strict: true, [options.platform]: true, overwrite: true, noOutput: true }));

  // README.md
  promises.push(Deno.writeTextFile(path.resolve('./README.md'), `# ${newPackageFile.name} \n\n###### - ${username}`));

  // homepage
  const extension = options.script === 'typescript' ? '.tsx' : '.jsx';
  const hpDir = options.platform === 'next' ? path.resolve('pages/index' + extension) : options.platform === 'react' ? path.resolve('src/App' + extension) : '';

  const script = Deno.readTextFileSync(hpDir)
    .replaceAll('PROJECT-NAME', newPackageFile.name)
    .replaceAll('SCRIPT', options.script)
    .replaceAll('PLATFORM', options.platform)
    .replaceAll('STYLE', options.style);

  promises.push(Deno.writeTextFile(hpDir, script));

  return Promise.all(promises).then(async () => {
    clearInterval(int);
    await clearLastLine();
    print(chalk.blue(`  Wrote files (${total}) (${((Date.now() - startTime) / 1000).toFixed(3)}s)`));
    print(' ');
  });
}
