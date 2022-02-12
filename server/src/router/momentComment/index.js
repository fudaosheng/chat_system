const KoaRouter = require('koa-router');
const momentCommentController = require('../../controller/momentCommentController');

const router = new KoaRouter({ prefix: '/api/moment_comment' });

router.post('/submit_comment', momentCommentController.submitComment);

module.exports = router;