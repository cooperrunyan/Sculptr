import { app } from './app.js';
import { config as env } from 'https://deno.land/x/dotenv/mod.ts';

Object.entries(env()).forEach(([key, value]) => Deno.env.set(key, value));

await app.listen({ port: +Deno.env.get('PORT') });
