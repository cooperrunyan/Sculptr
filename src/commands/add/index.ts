import { licenses } from './../build/types/Configuration.ts';
import { path, fs } from '../../imports.ts';
import { root } from '../../root.ts';

const files = [
  {
    name: 'tsconfig',
    accessors: ['tsc', 'ts', 'typescript', 'tsconfig'],
  },
  {
    name: 'license',
    accessors: ['license', 'lic', 'lics', 'license.txt'],
  },
] as const;

type File = typeof files[number]['name'];
type InputFile = typeof files[number]['accessors'][number];

export default async function add(inputFile: InputFile, { log, strict, react, next, overwrite }: { [key: string]: boolean | undefined }) {
  // find the file
  const getFile = (input: string) => {
    for (const file of files) {
      for (const accessor of file.accessors) {
        if (input === accessor) return file.name;
      }
    }
    throw new Error('Invalid file type');
  };

  const file: File = getFile(inputFile);
  ////////////////////////////////////////////////////

  if (file === 'tsconfig') await tsconfig(file, { log, strict, react, next, overwrite });
  else if (file === 'license') await license({ log: log === true, overwrite: overwrite === true });
}

async function license({ log, overwrite }: { log: boolean; overwrite: boolean }) {
  const inputFile = Deno.args[2];
  const file = (() => {
    for (const licensetype of licenses) {
      for (const accessor of licensetype.accessors) {
        if (inputFile === accessor) {
          return licensetype.name;
        }
      }
    }
    return 'mit';
  })();
  const fileContent = JSON.parse(Deno.readTextFileSync(`../assets/out/files/license/license.json`))[file];

  if ((fs.existsSync(path.resolve('LICENSE')) || log) && !overwrite)
    return console.log(`${fs.existsSync(path.resolve('LICENSE')) ? "error: File: 'LICENSE' already exists. Here is the new content:\n\n" : ''}${fileContent}`);

  Deno.writeTextFileSync(path.resolve('LICENSE.txt'), fileContent);
}

async function tsconfig(file: File, { log, strict, react, next, overwrite }: { [key: string]: boolean | undefined }) {
  const getDir = (name: string) => {
    if (!next && !react) return `${root}/assets/out/files/tsconfig/tsconfig-${strict ? 'strict' : 'loose'}.json`;
    if (next && !react) return `${root}/assets/out/files/tsconfig/tsconfig-next--${strict ? 'strict' : 'loose'}.json`;
    if (!next && react) return `${root}/assets/out/files/tsconfig/tsconfig-react--${strict ? 'strict' : 'loose'}.json`;
    throw new Error('You cannot use --next AND --react');
  };

  const dir = getDir(file);
  const res = await fetch(dir);
  const fileContent = await res.text();

  if ((fs.existsSync(path.resolve('tsconfig.json')) || log) && !overwrite)
    return console.log(
      `${fs.existsSync(path.resolve('tsconfig.json')) ? "error: File: 'tsconfig.json' already exists. Here is the new code:\n\n" : ''}${fileContent}`,
    );

  Deno.writeTextFileSync(path.resolve('tsconfig.json'), fileContent);
}
