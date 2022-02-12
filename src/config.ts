import { base } from './base.ts';
import { yaml } from './deps.ts';

export default yaml.parse(Deno.readTextFileSync(new URL(`${base}config.yaml`))) as {
  name: string;
  author: string;
  description: string;
  version: string;
};
