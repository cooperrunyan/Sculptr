import * as path from 'https://deno.land/std/path/mod.ts';
import * as fs from 'https://deno.land/std/node/fs.ts';

function copyFile(source: string, target: string) {
  var targetFile = target;
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.resolve(path.join(target, path.basename(source)));
    }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

export default function cpRecursive(source: string, target: string, recursiveMode?: boolean) {
  let files = [];
  let param2: string;
  recursiveMode ? (param2 = path.basename(source)) : (param2 = '');
  const targetFolder = path.resolve(path.join(target, param2));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file: string) {
      const curSource = path.resolve(path.join(source, file));
      if (fs.lstatSync(curSource).isDirectory()) {
        cpRecursive(curSource, targetFolder, true);
      } else {
        copyFile(curSource, targetFolder);
      }
    });
  }
}
