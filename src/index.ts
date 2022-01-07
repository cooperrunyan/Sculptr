import { root } from './root.ts';
import { Command } from 'https://deno.land/x/cmd@v1.2.0/mod.ts';

import build from './commands/build/build.ts';
import add from './commands/add/index.ts';
import use from './commands/use/index.ts';

const program = new Command();

const version = '0.0.28';
program.version(version).description('A command line tool for creating your projects');
program
  .command('build <platform> <name>')
  .alias('b')
  .description(
    "Builds scaffolding for a new project. <platform> should be 'next' or 'react'. <name> should be the name of the project, or directory to the project.",
  )
  .option('--s,--skip')
  .option('--scss')
  .option('--sass')
  .option('--css')
  .option('--ts,--typescript')
  .option('--js,--javascript')
  .action(
    (
      platform: 'next' | 'react' | 'n' | 'r',
      dir: string,
      args: {
        scss: boolean;
        typescript: boolean;
        css: boolean;
        javascript: boolean;
        skip: boolean;
      },
    ) => {
      if (platform === 'n') platform = 'next';
      if (platform === 'r') platform = 'react';
      build(dir, { platform, booleanOptions: { ...args } });
    },
  );

program
  .command('add <file>')
  .option('--log', 'Log the file instead of writing it')
  .option('-S --no-strict', 'Uses stricter typescript settings')
  .option('--react')
  .option('--next')
  .option('--overwrite')
  .description('Adds a new asset to your project.')
  .action(add);

program
  .command('use [version]')
  .alias('install')
  .alias('update')
  .description('Installs a given version of sculptr (defaults to the latest version)')
  .action(use);

program.parse(Deno.args);

export default {
  build,
  add,
  use,
};
