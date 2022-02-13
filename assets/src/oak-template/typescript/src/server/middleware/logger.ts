import { oak } from '../../deps.ts';

export async function logger(ctx: oak.Context, next: () => Promise<unknown>) {
  console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
  await next();
}
