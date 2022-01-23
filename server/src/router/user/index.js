const userController = require('../../controller/userController');
const KoaRouter = require('koa-router');

const router = new KoaRouter({ prefix: '/api/user' });

router.post('/login', userController.login);

router.post('/registry', userController.registryUser);

router.post('/update/avatar', userController.setUserAvatar);

// 更新个性签名
router.post('/update/bio', userController.setUserBio);

router.post('/update/info', userController.updateUserInfo);

// 根据name模糊搜索用户
router.get('/get/user_list_by_name', userController.getUserListByName);

// 根据用户ID精确搜索
router.get('/get/user_by_id', userController.getUserById);

module.exports = router;