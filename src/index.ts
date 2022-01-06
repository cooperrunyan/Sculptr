#!/usr/bin/env node

import { Command } from 'https://deno.land/x/cmd@v1.2.0/mod.ts';

import build from './commands/build/build.ts';
import generate from './commands/asset-generator/main.ts';
import add from './commands/add/index.ts';

const program = new Command();

program.version('0.0.0').description('A command line tool for creating your projects');
program
  .command('build <platform> <name>')
  .alias('b')
  .description(
    "Builds scaffolding for a new project. <platform> should be 'next' or 'react' (other platforms are currently in development). <name> should be the name of the project, or directory to the project.",
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

program.command('add <name>').alias('a').option('-y --overwrite').option('--no-strict --loose').description('Adds a new asset to your project.').action(add);

program.command('next-pwa').description('Generates assets for PWA').option('--logo <path>').option('--manifest <path>').action(generate);
program.parse(Deno.args);

export default {
  build,
  generate,
  add,
};
