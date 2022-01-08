import config from '../config.ts';

import { chalk } from '../../../imports.ts';

export default function makeScripts(scriptsObj: {}) {
  let str: string[] = [];
  Object.entries(scriptsObj).forEach(([key, value]) => {
    str.push(`${config.prefix}  ${(chalk.red(key) + ':').padEnd('/x1B[31mstyle/x1B[39m:  '.length - 8)}  ${chalk.green(`'${value}'`)}`);
  });

  return str.join(',\n');
}
