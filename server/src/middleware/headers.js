const headers = async (ctx, next) => {
  // cors
  ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Request-Method', 'PUT,POST,GET,DELETE,OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, cc');
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }
  await next();
};

module.exports = headers;
