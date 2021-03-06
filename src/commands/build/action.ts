import { Style, Script } from './../../types/index.ts';
import { askQuestions, getQuestions } from './askQuestions/index.ts';

import { copy } from './utils/copy.ts';
import { exec } from './utils/exec.ts';

import { write } from './write/index.ts';

import { base } from '../../base.ts';
import { Configuration, IncompleteConfig } from '../../types/index.ts';
import * as support from '../../support/index.ts';
import { fs, path } from '../../deps.ts';
import { print } from './utils/print.ts';

export async function action(end: 'front' | 'back', directory: string, options: IncompleteConfig): Promise<void> {
  fs.ensureDirSync(path.resolve(directory));
  Deno.chdir(path.resolve(directory));

  if (!support.platforms.includes(options.platform)) throw new Error(`"${options.platform}" is not a supported platform`);

  const answers = await askQuestions(getQuestions(options, end === 'front'));

  const settings: Configuration =
    end === 'front'
      ? {
          style: ((answers.style as string).toLowerCase() as Style) || options.style,
          script: ((answers.script as string).toLowerCase() as Script) || options.script,
          ...options,
          license: options.license || 'mit',
          strict: !!options.strict,
        }
      : {
          script: ((answers.script as string).toLowerCase() as Script) || options.script,
          ...options,
          style: 'scss',
          license: options.license || 'mit',
          strict: !!options.strict,
        };

  if (answers.style) settings.style = answers.style.toLowerCase() as Style;
  if (answers.script) settings.script = answers.script.toLowerCase() as Script;
  if (!settings.script || !settings.style) return;

  const username = (await exec('git config --global --get user.name').catch((err) => {})) || 'YOUR_NAME';
  print(' ');

  await copy(`${base}assets/out/${settings.platform}-template/${settings.script}${end === 'front' ? '/' + settings.style : ''}.json`);
  return write(end, settings, username);
}
