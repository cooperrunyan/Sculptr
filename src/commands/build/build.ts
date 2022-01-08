import ask from './ask.ts';

import { path } from '../../imports.ts';

import type Args from './types/BuildArgs.ts';
import type Configuration from './types/Configuration.ts';

import cpRecursive from './utils/copy.ts';
import exec from './utils/exec.ts';
import print from './utils/print.ts';

import changeCWD from './changeCWD.ts';
import createOptions from './createOptions.ts';
import getQuestions from './questions.ts';
import rewriteFiles from './rewriteFiles.ts';
import tree from './tree.ts';
import install from './install.ts';
import complete from './complete.ts';

import { root } from '../../root.ts';

export default async function build(dir: string, args: Args): Promise<void> {
  /////////////////////////////////////////
  // Change working directory
  changeCWD(dir);

  /////////////////////////////////////////
  // Change args to a complete options object of type Configuration
  const options: Configuration = createOptions(args);

  /////////////////////////////////////////
  // Replace ASK values by asking for the correct type
  const answers = await ask(getQuestions(options));

  if (answers.style) options.style = answers.style.toLowerCase() as Configuration['style'];
  if (answers.script) options.script = answers.script.toLowerCase() as Configuration['script'];

  /////////////////////////////////////////
  // Get the path to the proper directory
  const origin = `${options.platform}-template/${options.script}/${options.style}`;

  /////////////////////////////////////////
  // Copy all the files into the cwd
  print(`Writing files...`);
  await cpRecursive(`${root}/assets/out/${origin}`, path.resolve('.'));

  /////////////////////////////////////////
  // Get username from github
  const username = (await exec('git config --global --get user.name').catch(err => console.error(err))) as string;

  /////////////////////////////////////////
  // Rewrite files
  const packageJSON = await rewriteFiles(options, username as string);
  const { scripts, name }: { name: string; scripts: {} } = packageJSON;

  /////////////////////////////////////////
  // Make a tree of the project
  await tree();

  /////////////////////////////////////////
  // Install dependencies
  await install(args);

  /////////////////////////////////////////
  // Completion message
  complete(options, { name, username, scripts });

  /////////////////////////////////////////

  return;
}
