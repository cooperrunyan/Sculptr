export { licenses } from './../build/types/Configuration.ts';
import { licenses } from './../build/types/Configuration.ts';
import { path, fs } from '../../imports.ts';
import { root } from '../../root.ts';
import exec from '../build/utils/exec.ts';

export const files = [
  {
    name: 'tsconfig',
    accessors: ['tsc', 'ts', 'typescript', 'tsconfig'],
  },
  {
    name: 'license',
    accessors: ['license', 'lic', 'lics', 'license.txt'],
  },
] as const;

export type File = typeof files[number]['name'];
export type InputFile = typeof files[number]['accessors'][number];

// export default async function add(
//   inputFile: InputFile,
//   licenseType: typeof licenses[number]['name'],
//   { log, strict, react, next, overwrite }: { [key: string]: boolean | undefined },
// ) {
//   // find the file
//   const getFile = (input: string) => {
//     for (const file of files) {
//       for (const accessor of file.accessors) {
//         if (input === accessor) return file.name;
//       }
//     }
//     throw new Error('Invalid file type');
//   };

//   const file: File = getFile(inputFile);
//   ////////////////////////////////////////////////////

//   if (file === 'tsconfig') await tsconfig({ log, strict, react, next, overwrite });
//   else if (file === 'license') await license(licenseType, { log: log === true });
// }

export default {
  license,
  tsconfig,
};

export async function license(licenseType: typeof licenses[number]['name'], { log }: { log: boolean }) {
  const inputFile = licenseType;
  const file = (() => {
    for (const licensetype of licenses) {
      if (licensetype.accessor.test(inputFile)) return licensetype.name;
    }
    throw new Error('We do not support that license type (check your spelling)');
  })();
  const fileContent = JSON.parse(Deno.readTextFileSync(`../assets/out/files/license/license.json`))
    [file].replaceAll('[fullname]', await exec('git config --global --get user.name'))
    .replaceAll('[year]', new Date().getFullYear())
    .replaceAll('[email]', await exec('git config --global --get user.email'))
    .replaceAll('[project]', path.resolve('.').split('/').at(-1));

  if (log) return console.log(fileContent);

  Deno.writeTextFileSync(path.resolve('LICENSE.txt'), fileContent);
}

export async function tsconfig({ log, strict, react, next, overwrite }: { [key: string]: boolean | undefined }) {
  const getDir = () => {
    if (!next && !react) return `${root}/assets/out/files/tsconfig/tsconfig-${strict ? 'strict' : 'loose'}.json`;
    if (next && !react) return `${root}/assets/out/files/tsconfig/tsconfig-next--${strict ? 'strict' : 'loose'}.json`;
    if (!next && react) return `${root}/assets/out/files/tsconfig/tsconfig-react--${strict ? 'strict' : 'loose'}.json`;
    throw new Error('You cannot use --next AND --react');
  };

  const dir = getDir();
  const res = await fetch(dir);
  const fileContent = await res.text();

  if ((fs.existsSync(path.resolve('tsconfig.json')) || log) && !overwrite)
    return console.log(
      `${fs.existsSync(path.resolve('tsconfig.json')) ? "error: File: 'tsconfig.json' already exists. Here is the new code:\n\n" : ''}${fileContent}`,
    );

  Deno.writeTextFileSync(path.resolve('tsconfig.json'), fileContent);
}
