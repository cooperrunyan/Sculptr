import exec from '../build/utils/exec.ts';

export default async function update() {
  const response = await fetch('https://api.github.com/repos/cooperrunyan/Sculptr/releases');
  const version = (await response.json())[0].tag_name;

  const res = await exec(
    `deno install --unstable --allow-write --allow-read --allow-net --allow-run -n sculptr --allow-env -f https://deno.land/x/sculptr@${version}/mod.js`,
  );

  console.log(`Successfully installed sculptr@${version}`);
}
