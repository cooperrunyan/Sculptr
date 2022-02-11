import { DenoLandProvider, UpgradeCommand } from '../../deps.ts';

export const command = new UpgradeCommand({
  main: 'src/index.ts',
  args: ['-A', '--unstable'],
  provider: new DenoLandProvider(),
});

command.name('update').alias('upgrade').alias('install');
