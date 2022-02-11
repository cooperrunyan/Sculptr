import { yaml } from './deps.ts';

export default yaml.parse(Deno.readTextFileSync('./config.yaml')) as {
  name: string;
  author: string;
  description: string;
  version: string;
};
