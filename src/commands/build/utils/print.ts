import config from '../config.ts';

export default function print(str?: string, dontLog?: boolean) {
  if (!dontLog) return console.log(config.prefix + str?.replaceAll('\n', '\n' + config.prefix));
  return config.prefix + str?.replaceAll('\n', '\n' + config.prefix);
}
