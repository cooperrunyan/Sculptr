import { cliffy } from './deps.ts';

import { command as build } from './commands/build/command.ts';
import { command as use } from './commands/use/command.ts';
import { command as add } from './commands/add/command.ts';

import buildFunc from './commands/build/build.ts';
import useFunc from './commands/use/index.ts';
import addFunc from './commands/add/index.ts';

const program = new cliffy.Command();

const version = '0.3.5';
program.version(version).description('A command line tool for creating your projects');

program.command('build <platform> <name>', build);
program.command('use [version]', use);
program.command('add <file>', add).description('Add an asset to your cwd');

program.parse(Deno.args);

export default {
  build: buildFunc,
  use: useFunc,
  add: addFunc,
};
