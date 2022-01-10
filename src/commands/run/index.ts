import { path, readLines, writeAll } from '../../imports.ts';

export default async function run(script: string) {
  const json: { scripts: { [key: string]: string } } = JSON.parse(Deno.readTextFileSync(path.resolve('./sculptr.json')));
  const cmds: any = json.scripts[script]
    .split(';')
    .join('&&')
    .split('&&')
    .map((str: string) => str.trim());

  for (let cmd of cmds) {
    const index = cmds.indexOf(cmd);
    let cmdArr = cmd
      .replaceAll(/(('|").+('|"))/gi, (word: string) => {
        return word.replaceAll(' ', 'SCULPTR_TEMP_SPACE');
      })
      .split(' ');

    cmdArr = cmdArr.map((string: string) => {
      return string.replaceAll('SCULPTR_TEMP_SPACE', ' ');
    });

    cmds[index] = cmdArr;
  }

  // console.log(cmds);

  const commands = [
    ['rm', '-rf', './TEST'],
    ['mkdir', './TEST'],
    ['cmd', '/c', 'cd', './TEST'],
    // ['deno', 'run', '--unstable', '--allow-read', '--allow-write', '--allow-run', '--allow-env', '../src/index.ts', 'add', 'license', 'afl'],
  ];

  async function pipeThrough(reader: Deno.Reader, writer: Deno.Writer) {
    const encoder = new TextEncoder();
    for await (const line of readLines(reader)) {
      await writeAll(writer, encoder.encode(`${line.trim()}\n`));
    }
  }

  try {
    for (const cmd of commands) {
      await runCommand(cmd);
    }
  } catch (err) {
    console.error(err);
  }

  async function runCommand(cmd: string[]) {
    console.log(cmd);
    const res = Deno.run({
      cmd,
      stdout: 'piped',
      stderr: 'piped',
      cwd: Deno.cwd(),
    });

    await pipeThrough(res.stdout, Deno.stdout);
    await pipeThrough(res.stderr, Deno.stderr);
    await res.status();

    return;
  }
}
