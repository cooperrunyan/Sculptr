import { cliffy } from './deps.ts';

import * as build from './commands/build/index.ts';
import * as update from './commands/update/index.ts';
import * as add from './commands/add/index.ts';

import config from './config.ts';

export const cli = new cliffy.Command();

cli.name(config.name).version(config.version).description(config.description);

cli.command('build', build.command);
cli.command('add', add.command);
cli.command('update', update.command);

cli.parse(Deno.args);

export default {
  build: build.action,
  add: {
    license: add.actions.license,
    tsconfig: add.actions.tsconfig,
  },
};
