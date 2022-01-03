const userController = require('../../controller/user');
const KoaRouter = require('koa-router');

const router = new KoaRouter({ prefix: '/api/user' });

router.post('/login', userController.login);

router.post('/registry', userController.registryUser);

router.post('/update/avatar', userController.setUserAvatar);

// 更新个性签名
router.post('/update/bio', userController.setUserBio);

router.post('/update/info', userController.updateUserInfo);

module.exports = router;