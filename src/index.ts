import { Command } from './imports.ts';

import build from './commands/build/build.ts';
import add, { files, InputFile, licenses } from './commands/add/index.ts';
import use from './commands/use/index.ts';

const tsconfigAccessors = (() => {
  for (const file of files) {
    if (file.name === 'tsconfig') return file.accessors;
  }
})();

const licenseAccessors = (() => {
  for (const file of files) {
    if (file.name === 'license') return file.accessors;
  }
})();

const program = new Command();

const version = '0.2.0';
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
  .command('add <file> [variant]')
  .option('--log', 'Log the file instead of writing it')
  .option('-S --no-strict', 'Uses stricter typescript settings')
  .option('--react')
  .option('--next')
  .option('--overwrite')
  .description('Adds a new asset to your project.')
  .action((inputFile: InputFile, licenseType: typeof licenses[number]['name'], options: { [key: string]: boolean | undefined; log: boolean }) => {
    if (
      (() => {
        if (tsconfigAccessors)
          for (const accessor of tsconfigAccessors) {
            if (accessor === inputFile) return true;
          }
        return false;
      })()
    )
      add.tsconfig(options);
    else if (
      (() => {
        if (licenseAccessors)
          for (const accessor of licenseAccessors) {
            if (accessor === inputFile) return true;
          }
        return false;
      })()
    )
      add.license(licenseType, options);
  });

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
