import exec from '../build/utils/exec.ts';

export default async function update() {
  const res = (
    await exec('deno install --unstable --allow-write --allow-read --allow-net --allow-run -n sculptr --allow-env -f https://deno.land/x/sculptr/mod.js')
  )
    .split('\n')[0]
    .replace('✅ ', '');

  const response = await fetch('https://deno.land/x/sculptr/src/info.json');
  const { version } = await response.json();

  console.log(res.trim() + '@' + version);
}
