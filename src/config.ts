import { yml } from './deps.ts';

export default yml.parse(new TextDecoder().decode(Deno.readFileSync('../config.yml'))) as {
  name: string;
  author: string;
  description: string;
  version: string;
};
