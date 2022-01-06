export default async function exec(cmd: string): Promise<string> {
  return new Promise(async resolve => {
    const p = Deno.run({ cmd: cmd.split(' '), stderr: 'piped', stdout: 'piped' });

    const [_, stdout] = await Promise.all([p.status(), p.output(), p.stderrOutput()]);

    const outStr = new TextDecoder().decode(stdout);

    resolve(outStr.trim());
  });
}
