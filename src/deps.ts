export * as path from 'https://deno.land/std@0.120.0/path/mod.ts';
export * as fs from 'https://deno.land/std@0.95.0/fs/mod.ts';
export * as cliffy from 'https://deno.land/x/cliffy@v0.20.1/mod.ts';
export * as yaml from 'https://deno.land/std@0.125.0/encoding/yaml.ts';
export * as question from 'https://raw.githubusercontent.com/ocpu/question-deno/master/mod.ts';

// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import { Chalk } from 'https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js';
export const chalk = new Chalk();

export { DenoLandProvider, UpgradeCommand } from 'https://deno.land/x/cliffy/command/upgrade/mod.ts';
