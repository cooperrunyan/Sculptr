import { DenoLandProvider, UpgradeCommand } from '../../deps.ts';

export const command = new UpgradeCommand({
  main: 'https://deno.land/x/sculptr/src/index.ts',
  args: ['-A', '--unstable'],
  provider: new DenoLandProvider(),
});

command.name('update').alias('upgrade').alias('install');
