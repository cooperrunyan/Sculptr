import * as fs from 'https://deno.land/std/node/fs.ts';
import * as path from 'https://deno.land/std/path/mod.ts';
import type Configuration from './types/Configuration.ts';
import exec from './utils/exec.ts';
import makeLicense from './utils/makeLicense.ts';
import { root } from '../../root.ts';

export default async function rewriteFiles(options: Configuration, username: string) {
  /////////////////////////////////////////
  // package.json
  const oldPackage = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));
  fs.unlinkSync(path.resolve('./package.json'));
  await exec('npm init -y');
  const newPackageFile = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));

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

  fs.writeFileSync(path.resolve('./package.json'), JSON.stringify(newPackageFile, null, 2));

  // gitignore
  fs.writeFileSync(path.resolve('./.gitignore'), 'node_modules\n');

  // license
  fs.writeFileSync(path.resolve('./LICENSE'), makeLicense(username || 'YOUR NAME'));

  // tsconfig
  // await exec(`node ${root}/index.js add tsc`);

  // README.md
  fs.writeFileSync(path.resolve('./README.md'), `# ${projectName} \n\n###### - ${username}`);

  // homepage
  const extension = options.script === 'typescript' ? '.tsx' : '.jsx';
  const hpDir = options.platform === 'next' ? path.resolve('pages/index' + extension) : options.platform === 'react' ? path.resolve('src/App' + extension) : '';

  const script = fs
    .readFileSync(hpDir, 'utf-8')
    .replaceAll('PROJECT-NAME', projectName)
    .replaceAll('SCRIPT', options.script)
    .replaceAll('PLATFORM', options.platform)
    .replaceAll('STYLE', options.style);

  fs.writeFileSync(hpDir, script);

  return newPackageFile;
  /////////////////////////////////////////
}
