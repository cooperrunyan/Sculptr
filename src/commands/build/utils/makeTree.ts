import { jsonTree } from '../../../imports.ts';

import config from '../config.ts';

import { path, chalk } from '../../../imports.ts';

let files: string[] = [];
export default async function () {
  const tree = makeTree();

  let str: string | string[];
  str = tree
    .replaceAll(/((\d)|(\d\d)): /gm, '')
    .split('\n')
    .slice(0, -1);

  for (let i = 0; i < str.length; i++) {
    str[i] = config.prefix + str[i];
  }

  return str
    .join('\n')
    .padEnd(str.length + 10, ' ')
    .padStart(str.length + 10, ' ')
    .replaceAll(/\├|\||\│|\└|\─/g, (c: string) => chalk.grey(c))
    .replaceAll(/(?<=\.)css(?=(\W|$))/g, chalk.cyan('css'))
    .replaceAll(/(?<=\.)scss(?=(\W|$))/g, chalk.red('scss'))
    .replaceAll(/(?<=\.)sass(?=(\W|$))/g, chalk.red('sass'))
    .replaceAll(/(?<=\.)tsx(?=(\W|$))/g, chalk.blue('tsx'))
    .replaceAll(/(?<=\.)d\.ts(?=(\W|$))/g, chalk.green('d.ts'))
    .replaceAll(/(?<=\.)(?<!d\.)ts(?=(\W|$))/g, chalk.blue('ts'))
    .replaceAll(/(?<=\.)jsx(?=(\W|$))/g, chalk.cyan('jsx'))
    .replaceAll(/(?<=\.)js(?=(\W|$))/g, chalk.yellowBright('js'))
    .replaceAll(/(?<=\.)html(?=(\W|$))/g, chalk.yellow('html'))
    .replaceAll(/(?<=\.)json(?=(\W|$))/g, chalk.red('json'))
    .replaceAll(/LICENSE(?=(\W|$))/g, chalk.yellow('LICENSE'))
    .replaceAll(/(?<=\.)js\.map(?=(\W|$))/g, chalk.yellow('js.map'))
    .trim();
}

function makeTree(): string {
  dirTree('.');

  files.forEach(file => file.replace('./', ''));

  const info: any = {};

  files.forEach(file => {
    const arr = file.split('/');

    info[arr[0]] = isDir([arr[0]]) ? info[arr[0]] || {} : arr[0];

    if (checkValidFile(info, arr, 0)) info[arr[0]][arr[1]] = isDir([arr[0], arr[1]]) ? info[arr[0]][arr[1]] || {} : arr[1];
    if (checkValidFile(info, arr, 1)) info[arr[0]][arr[1]][arr[2]] = isDir([arr[0], arr[1], arr[2]]) ? info[arr[0]][arr[1]][arr[2]] || {} : arr[2];
    if (checkValidFile(info, arr, 2))
      info[arr[0]][arr[1]][arr[2]][arr[3]] = isDir([arr[0], arr[1], arr[2], arr[3]]) ? info[arr[0]][arr[1]][arr[2]][arr[3]] || {} : arr[3];
    if (checkValidFile(info, arr, 3))
      info[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]] = isDir([arr[0], arr[1], arr[2], arr[3], arr[4]])
        ? info[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]] || {}
        : arr[4];
  });

  const t = jsonTree(info['.'], true, false)
    .replaceAll(/: \w+.\w+.+|: .\w+/gi, '')
    .split('\n')
    .map(value => value.replaceAll(/.+undefined/gi, ''))
    .filter(value => value.trim() !== '')
    .join('\n');

  return t;
}

function dirTree(filename: any) {
  files.push(filename);
  const stats = Deno.lstatSync(filename);
  const info: any = { name: filename };
  if (stats.isDirectory) {
    Array.from(Deno.readDirSync(filename))?.forEach(child => {
      info[child.name] = child.name;
      dirTree(filename + '/' + child.name);
    });
  } else return info;
}

function isDir(segments: string[]): boolean {
  const p =
    segments.length === 1
      ? [segments[0] || '']
      : segments.length === 2
      ? [segments[0] || '', segments[1] || '']
      : segments.length === 3
      ? [segments[0] || '', segments[1] || '', segments[2] || '']
      : segments.length === 4
      ? [segments[0] || '', segments[1] || '', segments[2] || '', segments[3] || '']
      : segments.length === 5
      ? [segments[0] || '', segments[1] || '', segments[2] || '', segments[3] || '', segments[4] || '']
      : [segments[0] || '', segments[1] || '', segments[2] || '', segments[3] || '', segments[4] || '', segments[5] || ''];
  return Deno.lstatSync(path.resolve(...p)).isDirectory && !Deno.lstatSync(path.resolve(...p)).isFile;
}

function checkValidFile(info: { [key: string]: any }, arr: string[], level: number) {
  if (level === 0) return info[arr[0]] && typeof info[arr[0]] !== 'string';
  if (level === 1) return info[arr[0]] && info[arr[0]][arr[1]] && typeof info[arr[0]][arr[1]] !== 'string';
  if (level === 2) return info[arr[0]] && info[arr[0]][arr[1]] && info[arr[0]][arr[1]][arr[2]] && typeof info[arr[0]][arr[1]][arr[2]] !== 'string';
  if (level === 3)
    return (
      info[arr[0]] &&
      info[arr[0]][arr[1]] &&
      info[arr[0]][arr[1]][arr[2]] &&
      info[arr[0]][arr[1]][arr[2]][arr[3]] &&
      typeof info[arr[0]][arr[1]][arr[2]][arr[3]] !== 'string'
    );
}
