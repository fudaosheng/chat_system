const KoaRouter = require('koa-router');
const momentsController = require('../../controller/momentsController');

const router = new KoaRouter({ prefix: '/api/moments' });

// 创建动态
router.post('/create', momentsController.createMomemt);

// 获取用户动态
router.get('/get_user_moments', momentsController.getUserMoments);

// 获取好友动态
router.get('/get_friends_moments', momentsController.getFriendsMoments);

module.exports = router;