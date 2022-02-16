import { Drash, env } from '../deps.js';
import * as resources from './resources/index.js';

Object.entries(env()).forEach(([key, value]) => Deno.env.set(key, value));

const server = new Drash.Server({
  hostname: '127.0.0.1',
  port: +Deno.env.get('PORT'),
  protocol: 'http',
  resources: Object.values(resources),
});

server.run();
console.log(`App running on port: ${Deno.env.get('PORT')}`);
