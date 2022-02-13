import { oak } from '../deps.js';
import * as routers from './routers/index.js';
import * as middlewares from './middleware/index.js';

export const app = new oak.Application();

app.addEventListener('listen', (e) => console.log(`App running on port: ${e.port}`));
app.addEventListener('error', (e) => console.error(e.error));

Object.values(middlewares).forEach((middleware) => {
  app.use(middleware);
});

Object.values(routers).forEach((router) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});
