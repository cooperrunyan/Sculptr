import { LicenseDescription } from './../../types/index.ts';
import { path, fs } from '../../deps.ts';
import { base } from '../../base.ts';
import { exec } from '../build/utils/exec.ts';

import { getFileJson } from './helpers/getFileJson.ts';
import { License } from '../../types/index.ts';

export async function license(
  license: License,
  options: Partial<{ name: string; year: string; email: string; project: string; write: boolean }> = { write: true },
) {
  const filename = license === 'unlicense' ? 'UNLICENSE.txt' : 'LICENSE.txt';

  const fileContent = ((await getFileJson('license.json', license)) as string)
    .replaceAll('[fullname]', options.name || (await exec('git config --global --get user.name')))
    .replaceAll('[year]', options.year || new Date().getFullYear() + '')
    .replaceAll('[email]', options.email || (await exec('git config --dglobal --get user.email')))
    .replaceAll('[project]', options.project || path.resolve('.').split('/').at(-1) + '');

  if (!options.write)
    return {
      wrote: false,
      filename: filename,
      content: fileContent,
      info: { name: '', id: '', year: 0, description: '', permissions: [], conditions: [], limitations: [] },
    };

  Deno.writeTextFileSync(path.resolve(filename), fileContent);

  const file = (await getFileJson('descriptions.json', license)) as LicenseDescription;

  return {
    wrote: true,
    filename: filename,
    content: fileContent,
    info: file,
  };
}

export async function tsconfig({ log, strict, react, next, overwrite, noOutput }: { [key: string]: boolean | undefined }) {
  const getDir = () => {
    if (!next && !react) return `${base.replace('file://', '')}/assets/out/files/tsconfig/tsconfig-${strict ? 'strict' : 'loose'}.json`;
    if (next && !react) return `${base.replace('file://', '')}/assets/out/files/tsconfig/tsconfig-next--${strict ? 'strict' : 'loose'}.json`;
    if (!next && react) return `${base.replace('file://', '')}/assets/out/files/tsconfig/tsconfig-react--${strict ? 'strict' : 'loose'}.json`;
    throw new Error('You cannot use --next AND --react');
  };

  const dir = getDir();
  const fileContent = !dir.startsWith('http') ? await Deno.readTextFile(dir) : await (await fetch(dir)).text();

  if ((fs.existsSync(path.resolve('tsconfig.json')) || log) && !overwrite)
    return console.log(
      `${fs.existsSync(path.resolve('tsconfig.json')) ? "error: File: 'tsconfig.json' already exists. Here is the new code:\n\n" : ''}${fileContent}`,
    );

  Deno.writeTextFileSync(path.resolve('tsconfig.json'), fileContent);
  if (!noOutput) console.log('Successfully wrote tsconfig.json');
}
