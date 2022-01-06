import * as path from 'https://deno.land/std/path/mod.ts';

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

export const root = __dirname;
