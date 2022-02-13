import { base } from './base.ts';
import { yaml } from './deps.ts';

export default yaml.parse(await (await fetch(new URL(`${base}config.yml`))).text()) as {
  name: string;
  author: string;
  description: string;
  version: string;
};
