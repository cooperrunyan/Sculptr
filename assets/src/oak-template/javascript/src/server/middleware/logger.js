export async function logger(ctx, next) {
  console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
  await next();
}
