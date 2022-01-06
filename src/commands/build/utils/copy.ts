import * as path from 'https://deno.land/std/path/mod.ts';
import * as fs from 'https://deno.land/std/node/fs.ts';
const decoder = new TextDecoder('utf-8');

async function copyFile(source: string, target: string) {
  var targetFile = target;
  if (fs.existsSync(path.resolve(target))) {
    if (!Deno.lstatSync(path.resolve(target)).isFile) {
      targetFile = path.resolve(path.join(target, path.basename(source)));
    }
  }
  fs.writeFileSync(targetFile, decoder.decode(Deno.readFileSync(source)));
}

export default async function cpRecursive(source: string, target: string, recursiveMode?: boolean) {
  let files = [];
  let param2: string;
  recursiveMode ? (param2 = path.basename(source)) : (param2 = '');
  const targetFolder = path.resolve(path.join(target, param2));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }
  for await (const file of Deno.readDir(source)) {
    const curSource = path.join(source, file as unknown as string);
    if (!Deno.lstatSync(curSource).isFile) {
      cpRecursive(curSource, targetFolder, true);
    } else {
      await copyFile(curSource, targetFolder);
    }
  }
}
