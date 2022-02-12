const KoaRouter = require('koa-router');
const momentCommentController = require('../../controller/momentCommentController');

const router = new KoaRouter({ prefix: '/api/moment_comment' });

// 用户提交评论
router.post('/submit_comment', momentCommentController.submitComment);

// 获取动态的评论列表
router.get('/get_comment_list', momentCommentController.getCommentList);

module.exports = router;