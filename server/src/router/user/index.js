const userController = require('../../controller/user');
const KoaRouter = require('koa-router');

const router = new KoaRouter({ prefix: '/api/user' });

router.post('/login', userController.login);

router.post('/registry', userController.registryUser);

router.post('/update/avatar', userController.setUserAvatar);

module.exports = router;