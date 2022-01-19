import { chalk } from '../../deps.ts';

class Config {
  public static prefix = chalk.grey('sculptr:    ');
  prefix = Config.prefix;
}

const config = new Config();

export default config;
