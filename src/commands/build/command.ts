import { cliffy } from '../../deps.ts';
import { Platform } from '../../types/index.ts';
import { action } from './action.ts';

export const command = new cliffy.Command();

command
  .alias('b')
  .description('Builds scaffolding for a new project.')
  .option('--skip,-s', 'Skip the node_modules installation')
  .option('--scss', 'Use SCSS as a styling language')
  .option('--sass', 'Use Sass as a styling language')
  .option('--css', 'Use CSS as a styling language')
  .option('--typescript, --ts', 'Use Typescript as a scripting language')
  .option('--javascript, --js', 'Use Javascript as a scripting language')
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
      if (_platform === undefined) return console.log(`"${platform}" is not a supported platform`);
      try {
        action(dir, {
          script: args.typescript ? 'typescript' : args.javascript ? 'javascript' : undefined,
          platform: _platform,
          style: args.scss ? 'scss' : args.css ? 'css' : args.sass ? 'sass' : undefined,
          installDependencies: !args.skip,
        });
      } catch (err) {
        console.log(err.message);
      }
    },
  );
