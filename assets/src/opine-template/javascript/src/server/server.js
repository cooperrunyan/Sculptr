import { opine, env } from '../deps.js';
import * as routers from './routers/index.js';

Object.entries(env()).forEach(([key, value]) => Deno.env.set(key, value));

const app = opine();

app.use(routers.test);

app.listen(+Deno.env.get('PORT'), () => console.log(`App listening on port: ${Deno.env.get('PORT')}`));
