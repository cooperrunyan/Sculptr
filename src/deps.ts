export * as path from 'https://deno.land/std@0.120.0/path/mod.ts';
export * as fs from 'https://deno.land/std@0.95.0/fs/mod.ts';
export * as question from 'https://raw.githubusercontent.com/ocpu/question-deno/master/mod.ts';

export { readLines } from 'https://deno.land/std@0.104.0/io/mod.ts';
export { writeAll } from 'https://deno.land/std@0.104.0/io/util.ts';

export * as cliffy from 'https://deno.land/x/cliffy@v0.20.1/mod.ts';
export { jsonTree } from 'https://deno.land/x/json_tree/mod.ts';

export * as color from 'https://deno.land/std@0.113.0/fmt/colors.ts';

//////////////// Export an instance of chalk
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import { Chalk } from 'https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js';
export const chalk = new Chalk();
