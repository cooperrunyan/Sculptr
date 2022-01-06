import * as path from 'https://deno.land/std/path/mod.ts';
import * as fs from 'https://deno.land/std/node/fs.ts';
import { root } from '../../root.ts';

// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import { Chalk } from 'https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js';
const chalk = new Chalk();

export default function add(file: string, { overwrite, loose }: { overwrite: boolean; loose: boolean }): void {
  const args: string[] = Deno.args.slice(1);
  const strict = loose !== true;

  let tsconfig: boolean = false;
  let sass: boolean = false;
  let scss: boolean = false;
  for (let i = 0; i < args.length; i++) {
    if (file === 'tsconfig' || file === 'tsconfig.json' || file === 'tsc' || args[i] === 'tsconfig' || args[i] === 'tsconfig.json' || args[i] === 'tsc')
      tsconfig = true;

    if (file === 'sass' || args[i] === 'sass') sass = true;
    if (file === 'scss' || args[i] === 'scss') scss = true;
  }

  tsconfig && writeTs(overwrite, strict);
  sass && writeSass();
  scss && writeScss();
}

function writeTs(overwrite: boolean, strict: boolean): void {
  const exists: boolean = fs.existsSync('./tsconfig.json');
  if (!exists) fs.copyFileSync(`../../../assets/files/tsconfig${strict ? '-file' : '-loose'}.json`, './tsconfig.json');
  else {
    if (!overwrite) {
      const tsc = JSON.parse(fs.readFileSync(path.resolve('./tsconfig.json'), 'utf-8'));
      const newTsc = JSON.parse(fs.readFileSync(`../../../assets/files/tsconfig${strict ? '-file' : '-loose'}.json`, 'utf-8'));

      tsc.compilerOptions = { ...tsc.compilerOptions, ...newTsc.compilerOptions };

      fs.writeFileSync('./tsconfig.json', JSON.stringify(tsc, null, 2));
    } else fs.writeFileSync('./tsconfig.json', fs.readFileSync(`../../../assets/files/tsconfig${strict ? '-file' : '-loose'}.json`, 'utf8'));
  }

  console.log(chalk.grey('sculptr:    ') + 'Added tsconfig.json');
}

function writeSass() {
  copyFolderRecursiveSync(`../../../assets/files/sass`, path.resolve('sass'));
}

function writeScss() {
  copyFolderRecursiveSync(`../../../assets/files/scss`, path.resolve('scss'));
}

const copyFileSync = function (source: string, target: string) {
  var targetFile = target;
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
};

function copyFolderRecursiveSync(source: string, target: string, recursiveMode?: boolean) {
  let files = [];
  let param2: string;
  recursiveMode ? (param2 = path.basename(source)) : (param2 = '');
  const targetFolder = path.join(target, param2);
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file: string) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder, true);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}
