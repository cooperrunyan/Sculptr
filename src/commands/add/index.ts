import {path, fs} from '../../imports.ts'
import { root } from '../../root.ts';

const files = [
  {
    name: 'tsconfig',
    accessors: ['tsc', 'ts', 'typescript', 'tsconfig'],
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

  if (file === 'tsconfig') {
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
}
