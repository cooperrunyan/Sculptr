import config from '../config.ts';

// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import { Chalk } from 'https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js';
const chalk = new Chalk();

export default function makeScripts(scriptsObj: {}) {
  let str: string[] = [];
  Object.entries(scriptsObj).forEach(([key, value]) => {
    str.push(`${config.prefix}  ${(chalk.red(key) + ':').padEnd('/x1B[31mstyle/x1B[39m:  '.length - 8)}  ${chalk.green(`'${value}'`)}`);
  });

  return str.join(',\n');
}
