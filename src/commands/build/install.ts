import type BuildArgs from './types/BuildArgs.ts';
import exec from './utils/exec.ts';
import print from './utils/print.ts';

export default async function install(args: BuildArgs) {
  if (args.booleanOptions.skip !== true) {
    print(`Installing dependencies...`);
    await exec('npm i');
    print('Dependencies installed');
    print('');
  }
}
