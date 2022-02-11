import { Style, Script } from './../../types/index.ts';
import { askQuestions, getQuestions } from './askQuestions/index.ts';

import { copy, copyPackage } from './utils/copy.ts';
import { exec } from './utils/exec.ts';

import { writePackage, rewriteFiles } from './rewriteFiles/index.ts';
import { installDependencies } from './installDependencies/index.ts';

import { base } from '../../base.ts';
import { Configuration, IncompleteConfig } from '../../types/index.ts';
import * as support from '../../support/index.ts';
import { fs, path } from '../../deps.ts';

export async function action(directory: string, options: IncompleteConfig): Promise<void> {
  fs.ensureDirSync(path.resolve(directory));
  Deno.chdir(path.resolve(directory));

  if (!support.platforms.includes(options.platform)) throw new Error(`"${options.platform}" is not a supported platform`);

  const answers = await askQuestions(getQuestions(options));

  const settings: Configuration = {
    style: ((answers.style as string).toLowerCase() as Style) || options.style,
    script: ((answers.script as string).toLowerCase() as Script) || options.script,
    ...options,
    license: options.license || 'mit',
    strict: !!options.strict,
  };

  if (answers.style) settings.style = answers.style.toLowerCase() as Style;
  if (answers.script) settings.script = answers.script.toLowerCase() as Script;
  if (!settings.script || !settings.style) return;

  const pathToFiles = `${settings.platform}-template/${settings.script}/${settings.style}`;
  const username = (await exec('git config --global --get user.name').catch((err) => {})) || 'YOUR_NAME';
  console.log(' ');

  await copyPackage(`${base}/assets/out/${pathToFiles}.json`);
  const packageJSON = await writePackage(settings, username);
  await copy(`${base}/assets/out/${pathToFiles}.json`);
  await rewriteFiles(settings, username, packageJSON.name, packageJSON);
  await installDependencies(options.installDependencies);

  return console.log(' ');
}
