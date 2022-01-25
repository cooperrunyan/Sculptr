import { Platform } from './../../types/index.ts';
import { Style, Script } from './../../types/index.ts';
import { ask } from './ask.ts';

import { copy, packageJson } from './utils/copy.ts';
import { exec } from './utils/exec.ts';

import { changeCWD } from './changeCWD.ts';
import { getQuestions } from './questions.ts';
import { writePackage, rewriteFiles } from './rewriteFiles.ts';
import { install } from './install.ts';

import { root } from '../../root.ts';
import { Configuration, IncompleteConfig } from '../../types/index.ts';
import * as support from '../../support/index.ts';

export async function _cmdBuild(
  args: Partial<{
    scss: boolean;
    css: boolean;
    sass: boolean;
    typescript: boolean;
    javascript: boolean;
    skip: boolean;
  }>,
  platform: Platform,
  dir: string,
) {
  const _platform: Platform | undefined = ['next', 'n'].includes(platform) ? 'next' : ['react', 'r'].includes(platform) ? 'react' : undefined;
  if (_platform === undefined) return console.log(`"${platform}" is not a supported platform`);
  try {
    _build({
      dir,
      settings: {
        script: args.typescript ? 'typescript' : args.javascript ? 'javascript' : undefined,
        platform: _platform,
        style: args.scss ? 'scss' : args.css ? 'css' : args.sass ? 'sass' : undefined,
        installDependencies: !args.skip,
      },
    });
  } catch (err) {
    console.log(err.message);
  }
}

export { _build as build };

async function _build({ dir, settings }: { dir: string; settings: IncompleteConfig }): Promise<void> {
  /////////////////////////////////////////
  // Change working directory
  changeCWD(dir);

  /////////////////////////////////////////
  // Check validity
  if (!support.platforms.includes(settings.platform)) throw new Error(`"${settings.platform}" is not a supported platform`);

  /////////////////////////////////////////
  // Replace undefined values by asking for the correct type
  const answers = await ask(getQuestions(settings));

  const options: Configuration = {
    style: ((answers.style as string).toLowerCase() as Style) || settings.style,
    script: ((answers.script as string).toLowerCase() as Script) || settings.script,
    ...settings,
    license: settings.license || 'mit',
    strict: !!settings.strict,
  };

  if (answers.style) options.style = answers.style.toLowerCase() as Style;
  if (answers.script) options.script = answers.script.toLowerCase() as Script;

  if (!options.script || !options.style) return;

  /////////////////////////////////////////
  // Get the path to the proper directory
  const origin = `${options.platform}-template/${options.script}/${options.style}`;

  /////////////////////////////////////////
  // Get username from github
  const username = (await exec('git config --global --get user.name').catch(err => console.error(err))) || 'Your-name';

  console.log(' ');
  /////////////////////////////////////////
  // Copy all the files into the cwd

  await packageJson(`${root}/assets/out/${origin}.json`);
  const packageJSON = await writePackage(options, username);

  await copy(`${root}/assets/out/${origin}.json`);

  await rewriteFiles(options, username, packageJSON.name, packageJSON);

  await install(settings.installDependencies);

  return console.log('  ');
}
