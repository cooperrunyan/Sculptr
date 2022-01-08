import type Configuration from './types/Configuration.ts';
import makeScripts from './utils/makeScripts.ts';
import print from './utils/print.ts';

import { chalk } from '../../imports.ts';

export default function complete(options: Configuration, { name, username, scripts }: { name: string; username: string; scripts: {} }) {
  print(`${chalk.yellow('Task completed')}
  Project Name:  ${chalk.cyan("'" + name + "'")}
  Username:      ${chalk.cyan("'" + username + "'")}
  `);

  print(
    `Built a new project with: ${chalk.blue(options.platform.charAt(0).toUpperCase() + options.platform.slice(1).toLowerCase())}, ${chalk.blue(
      options.script.charAt(0).toUpperCase() + options.script.slice(1).toLowerCase(),
    )}, ${chalk.blue(options.style.charAt(0).toUpperCase() + options.style.slice(1).toLowerCase())}`,
  );

  print('\nPrewritten scripts (in ./package.json):');
  console.log(makeScripts(scripts));
}
