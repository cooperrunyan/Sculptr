import { jsonTree } from 'https://deno.land/x/json_tree/mod.ts';

import config from '../config.ts';
import type Colors from '../types/Colors.ts';

// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import { Chalk } from 'https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js';
const chalk = new Chalk();

import * as fs from 'https://deno.land/std@0.95.0/fs/mod.ts';
import * as path from 'https://deno.land/std@0.120.0/path/mod.ts';

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

  str = str
    .join('\n')
    .padEnd(str.length + 10, ' ')
    .padStart(str.length + 10, ' ');

  const color = function (extension: string, color: Colors): string {
    const string = str.slice();
    let newStr = (string as string).split(`.${extension} `).join('.' + chalk[color](extension));
    newStr = newStr.split(`.${extension}\n`).join('.' + chalk[color](`${extension}\n`));
    newStr = newStr.split(`.${extension}\r`).join('.' + chalk[color](`${extension}\r`));

    return newStr;
  };

  str = str
    .split('|')
    .join(chalk.grey('|'))
    .split('│')
    .join(chalk.grey('│'))
    .split('└')
    .join(chalk.grey('└'))
    .split('─')
    .join(chalk.grey('─'))
    .split('├')
    .join(chalk.grey('├'))
    .split('\r\n')
    .join('  \r\n');

  str = color('css', 'cyan');
  str = color('scss', 'red');
  str = color('sass', 'red');
  str = color('tsx', 'blue');
  str = color('jsx', 'cyan');
  str = color('json', 'red');
  str = color('js', 'yellowBright');
  str = color('html', 'yellow');
  str = color('d.ts', 'green');
  str = color('ts', 'blue');

  str = str
    .split('.js.map ')
    .join('.' + chalk.yellowBright('js') + '.' + chalk.yellowBright('map'))
    .split('.js.map\n')
    .join('.' + chalk.yellowBright('js') + '.' + chalk.yellowBright('map\n'))
    .split('.js.map\r')
    .join('.' + chalk.yellowBright('js') + '.' + chalk.yellowBright('map\r'))
    .split('.d.ts')
    .join('.' + chalk.green('d.ts'))
    .split('.d.ts\n')
    .join('.' + chalk.green('d.ts\n'))
    .split('.d.ts\r')
    .join('.' + chalk.green('d.ts\r'))
    .split('LICENSE')
    .join(chalk.yellow('LICENSE'))
    .split('LICENSE\n')
    .join(chalk.yellow('LICENSE\n'))
    .split('LICENSE\r')
    .join(chalk.yellow('LICENSE\r'));

  return str.trim();
}

function makeTree(): string {
  dirTree('.');

  files.forEach(file => file.replace('./', ''));

  const info: any = {};

  files.forEach(file => {
    const arr = file.split('/');

    info[arr[0]] = Deno.lstatSync(path.resolve(arr[0] || '')).isDirectory && !Deno.lstatSync(path.resolve(arr[0] || '')).isFile ? info[arr[0]] || {} : arr[0];

    if (typeof info[arr[0]] !== 'string')
      info[arr[0]][arr[1]] =
        Deno.lstatSync(path.resolve(arr[0] || '', arr[1] || '')).isDirectory && !Deno.lstatSync(path.resolve(arr[0] || '', arr[1] || '')).isFile
          ? info[arr[0]][arr[1]] || {}
          : arr[1];

    if (info[arr[0]] && info[arr[0]][arr[1]] && typeof info[arr[0]][arr[1]] !== 'string')
      info[arr[0]][arr[1]][arr[2]] =
        Deno.lstatSync(path.resolve(arr[0] || '', arr[1] || '', arr[2] || '')).isDirectory &&
        !Deno.lstatSync(path.resolve(arr[0] || '', arr[1] || '', arr[2] || '')).isFile
          ? info[arr[0]][arr[1]][arr[2]] || {}
          : arr[2];

    if (info[arr[0]] && info[arr[0]][arr[1]] && info[arr[0]][arr[1]][arr[2]] && typeof info[arr[0]][arr[1]][arr[2]] !== 'string')
      info[arr[0]][arr[1]][arr[2]][arr[3]] =
        Deno.lstatSync(path.resolve(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '')).isDirectory &&
        !Deno.lstatSync(path.resolve(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '')).isFile
          ? info[arr[0]][arr[1]][arr[2]][arr[3]] || {}
          : arr[3];

    if (
      info[arr[0]] &&
      info[arr[0]][arr[1]] &&
      info[arr[0]][arr[1]][arr[2]] &&
      info[arr[0]][arr[1]][arr[2]][arr[3]] &&
      typeof info[arr[0]][arr[1]][arr[2]][arr[3]] !== 'string'
    )
      info[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]] =
        Deno.lstatSync(path.resolve(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '', arr[4] || '')).isDirectory &&
        !Deno.lstatSync(path.resolve(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '', arr[4] || '')).isFile
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
