import * as path from 'https://deno.land/std/path/mod.ts';
import * as url from 'https://deno.land/std/node/url.ts';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const root = path.resolve(__dirname);
