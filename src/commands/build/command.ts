import { cliffy } from '../../deps.ts';
import build from './build.ts';

export const command = new cliffy.Command();

command
  .alias('b')
  .description('Builds scaffolding for a new project.')
  .option('--skip,-s', 'Skip the node_modules installation')
  .option('--scss', 'Use SCSS as a styling language')
  .option('--sass', 'Use Sass as a styling language')
  .option('--css', 'Use CSS as a styling language')
  .option('--typescript,-ts', 'Use Typescript as a scripting language')
  .option('--javascript,-js', 'Use Javascript as a scripting language')
  .action(
    (
      args: {
        scss: boolean;
        typescript: boolean;
        css: boolean;
        javascript: boolean;
        skip: boolean;
      },
      platform: 'next' | 'react' | 'n' | 'r',
      dir: string,
    ) => {
      if (platform === 'n') platform = 'next';
      if (platform === 'r') platform = 'react';
      build(dir, { platform, booleanOptions: { ...args } });
    },
  );
