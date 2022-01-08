export * as path from 'https://deno.land/std@0.120.0/path/mod.ts';
export * as fs from 'https://deno.land/std@0.95.0/fs/mod.ts';
export * as commander from 'https://deno.land/x/cmd@v1.2.0/mod.ts';
export * as question from 'https://raw.githubusercontent.com/ocpu/question-deno/master/mod.ts';
export * as JsonTree from 'https://deno.land/x/json_tree/mod.ts';
export * as streams from 'https://deno.land/std/streams/conversion.ts';

//////////////// Export an instance of chalk
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import { Chalk } from 'https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js';
export const chalk = new Chalk();
