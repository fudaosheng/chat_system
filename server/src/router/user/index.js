const KoaRouter = require('koa-router');

const router = new KoaRouter({ prefix: '/user' });

router.post('/login', ctx => {
    console.log(ctx.request.body);
    ctx.body = 'login'
});

module.exports = router;