import { root } from './root.ts';
import * as fs from 'https://deno.land/std@0.95.0/fs/mod.ts';
import * as path from 'https://deno.land/std@0.120.0/path/mod.ts';

const templates = ['next-template', 'react-template'];
const scripts = ['typescript', 'javascript'];
const styles = ['scss', 'sass', 'css'];

function getTemplates() {
  const allFiles: any = {};

  templates.forEach(template => {
    scripts.forEach(script => {
      styles.forEach(style => {
        const p = path.resolve('./assets/src', template, script, style);
        const jsonObj: any = {};

        function file(pat: string) {
          if (Deno.lstatSync(pat).isDirectory) {
            // recursive

            const children = Deno.readDirSync(pat);
            for (const child of children) {
              const childPath = path.resolve(pat, child.name);
              file(childPath);
            }
          } else {
            // if it's a file
            const relativePath = pat.split(`${template}/${script}/${style}`)[1];

            const pathToImage = `${root}/assets/src/${template}/${script}/${style}${relativePath}`;

            if (/.png$|.ico$|.jpg$|.jpeg$/.test(pat)) jsonObj[relativePath] = pathToImage;
            else jsonObj[relativePath] = Deno.readTextFileSync(pat);
          }
        }
        file(p);

        allFiles[`${template}/${script}/${style}`] = jsonObj;
      });
    });
  });
  return allFiles;
}

function writeTemplates(files: { [key: string]: string }) {
  fs.emptyDirSync('../assets/out');
  templates.forEach(template => {
    fs.ensureDirSync(`./assets/out/${template}`);
    scripts.forEach(script => {
      fs.ensureDirSync(`./assets/out/${template}/${script}`);
      styles.forEach(style => {
        Deno.writeTextFileSync(`./assets/out/${template}/${script}/${style}.json`, JSON.stringify(files[`${template}/${script}/${style}`]));
      });
    });
  });
}

fs.emptyDirSync('./assets/out');
writeTemplates(getTemplates());
fs.copySync('./assets/src/files', 'assets/out/files');
fs.copySync('./assets/src/files/tsconfig/tsconfig-strict.json', 'assets/out/files/tsconfig/tsconfig.json');
