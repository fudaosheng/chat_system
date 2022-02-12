const KoaRouter = require('koa-router');
const momentLikeController = require('../../controller/momentLikeController');

const router = new KoaRouter({ prefix: '/api/moment_like' });

// 删除点赞
router.post('/unlike', momentLikeController.deleteLike);

// 点赞
router.post('/like', momentLikeController.like);
// 是否喜欢,能获取到数据则是喜欢
router.get('/get_like_moment_record', momentLikeController.getMomentLikeStatus);

// 获取联系人中点赞该动态的联系人列表
router.get('/get_like_moment_contact_list', momentLikeController.getCommenLikeUserList);

module.exports = router;