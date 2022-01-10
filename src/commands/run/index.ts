import { path, readLines, writeAll } from '../../imports.ts';

export default async function run(script: string) {
  const json: { scripts: { [key: string]: string } } = JSON.parse(Deno.readTextFileSync(path.resolve('./sculptr.json')));
  const cmd = json.scripts[script].split(' ');

  async function pipeThrough(reader: Deno.Reader, writer: Deno.Writer) {
    const encoder = new TextEncoder();
    for await (const line of readLines(reader)) {
      await writeAll(writer, encoder.encode(`${line}\n`));
    }
  }

  const res = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'piped',
  });

  pipeThrough(res.stdout, Deno.stdout);
  pipeThrough(res.stderr, Deno.stderr);
  await res.status();
}
