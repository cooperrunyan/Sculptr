import { exec } from '../build/utils/exec.ts';

export async function use({ version = 'latest' }: { version: string }) {
  const response = await fetch('https://api.github.com/repos/cooperrunyan/Sculptr/releases');
  const releases = await response.json();
  const [exists, actualVersion] = (() => {
    for (const release of releases) {
      if (release.tag_name === version) return [true, version];
    }
    if (version === 'latest' || version === '@latest') return [true, releases[0].tag_name];
    return [false];
  })();

  if (!exists) throw new Error('Ivalid version number');

  if (exists) {
    await exec(
      `deno install --unstable --allow-write --allow-read --allow-net --allow-run -n sculptr --allow-env -f https://deno.land/x/sculptr@${actualVersion}/src/index.ts`,
    );
    return console.log(`Successfully installed sculptr@${actualVersion}`);
  }

  if (!actualVersion) {
    await exec('deno install --unstable --allow-write --allow-read --allow-net --allow-run -n sculptr --allow-env -f https://deno.land/x/sculptr/src/index.ts');
    return console.log(`Successfully installed sculptr@${actualVersion}`);
  }

  console.log(`Successfully installed sculptr@${actualVersion}`);
}
