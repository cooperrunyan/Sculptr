import exec from '../build/utils/exec.ts';

export default async function use(number: string = 'latest') {
  console.log(number);
  const response = await fetch('https://api.github.com/repos/cooperrunyan/Sculptr/releases');
  const releases = await response.json();
  const [exists, version] = (() => {
    for (const release of releases) {
      if (release.tag_name === number) return [true, number];
    }
    if (number === 'latest' || number === '@latest') return [true, releases[0].tag_name];
    return [false];
  })();

  if (!exists) throw new Error('Ivalid version number');

  if (exists) {
    await exec(
      `deno install --unstable --allow-write --allow-read --allow-net --allow-run -n sculptr --allow-env -f https://deno.land/x/sculptr@${version}/src/index.ts`,
    );
    return console.log(`Successfully installed sculptr@${version}`);
  }

  if (!version) {
    await exec('deno install --unstable --allow-write --allow-read --allow-net --allow-run -n sculptr --allow-env -f https://deno.land/x/sculptr/src/index.ts');
    return console.log(`Successfully installed sculptr@${version}`);
  }

  console.log(`Successfully installed sculptr@${version}`);
}
