import { chalk } from '../../../deps.ts';

export default function makeScripts(scriptsObj: {}) {
  let str: string[] = [];
  Object.entries(scriptsObj).forEach(([key, value]) => {
    str.push(`  ${(chalk.red(key) + ':').padEnd('/x1B[31mstyle/x1B[39m:  '.length - 8)}  ${chalk.green(`'${value}'`)}`);
  });

  return str.join(',\n');
}
