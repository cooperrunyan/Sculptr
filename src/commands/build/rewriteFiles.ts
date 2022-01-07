import * as fs from 'https://deno.land/std@0.95.0/fs/mod.ts';
import * as path from 'https://deno.land/std@0.120.0/path/mod.ts';

import type Configuration from './types/Configuration.ts';
import exec from './utils/exec.ts';
import makeLicense from './utils/makeLicense.ts';
import add from '../add/index.ts';

export default async function rewriteFiles(options: Configuration, username: string) {
  /////////////////////////////////////////
  // package.json
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

  const projectName = newPackageFile.name;

  Deno.writeTextFileSync(path.resolve('./package.json'), JSON.stringify(newPackageFile, null, 2));

  // gitignore
  Deno.writeTextFileSync(path.resolve('./.gitignore'), 'node_modules\n');

  // license
  Deno.writeTextFileSync(path.resolve('./LICENSE'), makeLicense(username || 'YOUR NAME'));

  // tsconfig
  await add('tsc', { strict: true, [options.platform]: true, overwrite: true });

  // README.md
  Deno.writeTextFileSync(path.resolve('./README.md'), `# ${projectName} \n\n###### - ${username}`);

  // homepage
  const extension = options.script === 'typescript' ? '.tsx' : '.jsx';
  const hpDir = options.platform === 'next' ? path.resolve('pages/index' + extension) : options.platform === 'react' ? path.resolve('src/App' + extension) : '';

  const script = Deno.readTextFileSync(hpDir)
    .replaceAll('PROJECT-NAME', projectName)
    .replaceAll('SCRIPT', options.script)
    .replaceAll('PLATFORM', options.platform)
    .replaceAll('STYLE', options.style);

  Deno.writeTextFileSync(hpDir, script);

  return newPackageFile;
  /////////////////////////////////////////
}
