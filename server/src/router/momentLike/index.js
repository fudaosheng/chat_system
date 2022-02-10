const KoaRouter = require('koa-router');
const momentLikeController = require('../../controller/momentLikeController');

const router = new KoaRouter({ prefix: '/api/moment_like' });

// 删除点赞
router.post('/unlike', momentLikeController.deleteLike);

// 点赞
router.post('/like', momentLikeController.like);

module.exports = router;