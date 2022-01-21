import add from './index.ts';
import { cliffy } from '../../deps.ts';
import helpLicense from './helpLicense.ts';

export const command = new cliffy.Command();

const licenseHelp = new cliffy.Command();
licenseHelp.description('Get descriptions of license usage and types').action(helpLicense);

command
  .command('license [type]')
  .option('--describe,-d', 'Display a description of a given license type')
  .option('--log', 'Log the file instead of writing it')
  .option('--no-output', "Don't write a completion message")
  .option('--name [name]', 'Manually set the name to be written instead of using Github username')
  .option('--email [email]', 'Set the email, if the license uses one')
  .option('--project [project]', 'Set the project name, if the license uses one')
  .option('--year [year]', `Manually set the year, instead of ${new Date().getFullYear()}`)
  .description('Adds a new license to your project.')
  .action(add.license);

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
  .action(add.tsconfig);
