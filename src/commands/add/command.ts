import { cliffy } from '../../deps.ts';
import { licenseHelp as helpLicense } from './helpers/helpLicense.ts';
import * as actions from './actions.ts';
import { getLicense } from './helpers/getLicense.ts';
import { print } from '../build/utils/print.ts';

export const command = new cliffy.Command();

const licenseHelp = new cliffy.Command();
licenseHelp.description('Get descriptions of license usage and types').action(helpLicense);

command.name('add').arguments('<file>').description('Add an asset to your cwd');

command
  .command('license [type]')
  .alias('l')
  .option('--describe,-d', 'Display a description of a given license type')
  .option('--log', 'Log the file instead of writing it')
  .option('--no-output', "Don't write a completion message")
  .option('--name [name]', 'Manually set the name to be written instead of using Github username')
  .option('--email [email]', 'Set the email, if the license uses one')
  .option('--project [project]', 'Set the project name, if the license uses one')
  .option('--year [year]', `Manually set the year, instead of ${new Date().getFullYear()}`)
  .description('Adds a new license to your project.')
  .action(
    async (
      args: Partial<{ log: boolean; noOutput: boolean; name: string; year: string; email: string; project: string; describe: boolean }>,
      license: string,
    ) => {
      try {
        if (args.describe) return helpLicense(license);

        const res = await actions.license(getLicense(license), {
          name: args.name,
          year: args.year,
          email: args.email,
          project: args.project,
          write: !args.log,
        });

        if (!res.wrote) return print(res.content);

        if (!args.noOutput) print(`Successfully wrote ${res.info.name} (${res.info.id}) in ${res.filename} `);
      } catch (err) {
        print(err.message);
      }
    },
  );

command
  .command('tsconfig')
  .alias('tsc')
  .alias('typescript')
  .alias('ts')
  .option('--log', 'Log the file instead of writing it')
  .option('--no-output', "Don't write a completion message")
  .option('--strict', 'Uses strict typescript settings', { default: true })
  .option('--react', 'Use compilerOptions that cater to react')
  .option('--next', 'Use compilerOptions that cater to next')
  .option('--overwrite', 'Overwrite the current tsconfig.json if it exists')
  .description('Adds a tsconfig file to your project.')
  .action(actions.tsconfig);
