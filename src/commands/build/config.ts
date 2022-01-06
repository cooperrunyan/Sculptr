// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import { Chalk } from 'https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js';
const chalk = new Chalk();

class Config {
  public static prefix = chalk.grey('sculptr:    ');
  prefix = Config.prefix;
}

const config = new Config();

export default config;
