const userController = require('../../controller/user');
const KoaRouter = require('koa-router');

const router = new KoaRouter({ prefix: '/user' });

router.post('/login', userController.login);

router.post('/registry', userController.registryUser);

module.exports = router;