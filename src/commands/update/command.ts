import { DenoLandProvider, UpgradeCommand } from '../../deps.ts';

export const command = new UpgradeCommand({
  main: `https://deno.land/x/sculptr${(await (await fetch('https://api.github.com/repos/cooperrunyan/Sculptr/releases')).json())[0].tag_name}/src/index.ts`,
  args: ['-A', '--unstable'],
  provider: new DenoLandProvider(),
});

command.name('update').alias('upgrade').alias('install');
