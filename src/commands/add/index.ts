export { licenses } from './../build/types/Configuration.ts';
import { licenses } from './../build/types/Configuration.ts';
import { path, fs } from '../../deps.ts';
import { root } from '../../root.ts';
import exec from '../build/utils/exec.ts';
import { getLicense } from './getLicense.ts';

import helpLicense from './helpLicense.ts';

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
export type LicenseType = typeof licenses[number]['name'];

export default {
  license,
  tsconfig,
};

export async function license(
  {
    log,
    noOutput,
    name,
    year,
    email,
    project,
    licenseHelp,
  }: { log: boolean; noOutput?: boolean; name?: string; year?: string; email?: string; project?: string; licenseHelp?: string },
  license: LicenseType,
) {
  if (licenseHelp) return helpLicense(licenseHelp);
  const file = getLicense(license);

  const fileName = file === 'unlicense' ? 'UNLICENSE.txt' : 'LICENSE.txt';

  const fileContent = root.startsWith('file://')
    ? (JSON.parse(Deno.readTextFileSync(`${root.replace('file://', '')}/assets/out/files/license/license.json`))[file] as any)
        .replaceAll('[fullname]', name || (await exec('git config --global --get user.name')))
        .replaceAll('[year]', year || new Date().getFullYear())
        .replaceAll('[email]', email || (await exec('git config --global --get user.email')))
        .replaceAll('[project]', project || path.resolve('.').split('/').at(-1))
    : await ((await fetch(`${root}/assets/out/files/license/license.json`)) as any)
        .json()
        [file].replaceAll('[fullname]', name || (await exec('git config --global --get user.name')))
        .replaceAll('[year]', year || new Date().getFullYear())
        .replaceAll('[email]', email || (await exec('git config --global --get user.email')))
        .replaceAll('[project]', project || path.resolve('.').split('/').at(-1));

  if (log) return console.log(fileContent);

  Deno.writeTextFileSync(path.resolve(fileName), fileContent);
  if (!noOutput) console.log(`Successfully wrote ${fileName}`);
}

export async function tsconfig({ log, strict, react, next, overwrite, noOutput }: { [key: string]: boolean | undefined }) {
  const getDir = () => {
    if (!next && !react) return `${root.replace('file://', '')}/assets/out/files/tsconfig/tsconfig-${strict ? 'strict' : 'loose'}.json`;
    if (next && !react) return `${root.replace('file://', '')}/assets/out/files/tsconfig/tsconfig-next--${strict ? 'strict' : 'loose'}.json`;
    if (!next && react) return `${root.replace('file://', '')}/assets/out/files/tsconfig/tsconfig-react--${strict ? 'strict' : 'loose'}.json`;
    throw new Error('You cannot use --next AND --react');
  };

  const dir = getDir();
  const fileContent = await Deno.readTextFile(dir);

  if ((fs.existsSync(path.resolve('tsconfig.json')) || log) && !overwrite)
    return console.log(
      `${fs.existsSync(path.resolve('tsconfig.json')) ? "error: File: 'tsconfig.json' already exists. Here is the new code:\n\n" : ''}${fileContent}`,
    );

  Deno.writeTextFileSync(path.resolve('tsconfig.json'), fileContent);
  if (!noOutput) console.log('Successfully wrote tsconfig.json');
}
