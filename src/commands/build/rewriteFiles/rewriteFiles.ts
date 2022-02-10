import { chalk, path } from '../../../deps.ts';

import { exec } from '../utils/exec.ts';
import * as add from '../../add/index.ts';
import { Configuration } from '../../../types/index.ts';

export async function rewriteFiles(options: Configuration, username: string, projectName: string, newPackageFile: object) {
  const promises: Promise<any>[] = [];
  // gitignore
  promises.push(Deno.writeTextFile(path.resolve('./.gitignore'), 'node_modules\n'));

  // license
  promises.push(add.license('mit'));

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
