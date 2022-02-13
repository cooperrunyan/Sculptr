import { cliffy } from '../../deps.ts';
import { Platform } from '../../types/index.ts';
import { action } from './action.ts';
import { print } from './utils/print.ts';

export const command = new cliffy.Command();

command
  .command('front')
  .alias('frontend')
  .alias('web')
  .arguments('<platform> <name>')
  .description('Builds scaffolding for a new project.')
  .option('--scss', 'Use SCSS as a styling language')
  .option('--sass', 'Use Sass as a styling language')
  .option('--css', 'Use CSS as a styling language')
  .option('--typescript, --ts', 'Use Typescript as a scripting language')
  .option('--javascript, --js', 'Use Javascript as a scripting language')
  .example('Build a React app', 'react <name>')
  .example('Build a Next app', 'next <name>')
  .action(
    (
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
    ) => {
      const _platform: Platform | undefined = ['next', 'n'].includes(platform) ? 'next' : ['react', 'r'].includes(platform) ? 'react' : undefined;
      if (_platform === undefined) return print(`"${platform}" is not a supported platform`);
      try {
        action('front', dir, {
          script: args.typescript ? 'typescript' : args.javascript ? 'javascript' : undefined,
          platform: _platform,
          style: args.scss ? 'scss' : args.css ? 'css' : args.sass ? 'sass' : undefined,
          installDependencies: !args.skip,
        });
      } catch (err) {
        print(err.message);
      }
    },
  );

command
  .command('back')
  .alias('backend')
  .alias('api')
  .arguments('<platform> <name>')
  .description('Builds scaffolding for a new project.')
  .option('--typescript, --ts', 'Use Typescript as a scripting language')
  .option('--javascript, --js', 'Use Javascript as a scripting language')
  .example('Build an Oak app', 'oak <name>')
  .example('Build an Express app', 'express <name>')
  .action(
    (
      args: Partial<{
        typescript: boolean;
        javascript: boolean;
        skip: boolean;
      }>,
      platform: Platform,
      dir: string,
    ) => {
      const _platform: Platform | undefined = ['oak'].includes(platform) ? 'oak' : undefined;
      if (_platform === undefined) return print(`"${platform}" is not a supported platform`);
      try {
        action('back', dir, {
          script: args.typescript ? 'typescript' : args.javascript ? 'javascript' : undefined,
          platform: _platform,
          installDependencies: !args.skip,
        });
      } catch (err) {
        print(err.message);
      }
    },
  );
