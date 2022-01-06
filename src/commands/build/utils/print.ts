import config from '../config.ts';

export default function print(str?: string) {
  return console.log(config.prefix + str?.replaceAll('\n', '\n' + config.prefix));
}
