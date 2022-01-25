import { cliffy } from './deps.ts';

import { command as build } from './commands/build/command.ts';
import { command as use } from './commands/use/command.ts';
import { command as add } from './commands/add/command.ts';

import { build as buildFunc } from './commands/build/build.ts';
import { use as useFunc } from './commands/use/index.ts';
import * as addFunc from './commands/add/index.ts';

const program = new cliffy.Command();

const version = '1.0.6';
program.version(version).description('A command line tool for creating your projects');

program.command('build <platform> <name>', build);
program.command('use [version]', use);
program.command('add <file>', add).description('Add an asset to your cwd');

program.parse(Deno.args);

export default {
  build: buildFunc,
  use: useFunc,
  add: {
    tsconfig: addFunc.tsconfig,
    license: addFunc.license,
  },
};
