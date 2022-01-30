const KoaRouter = require('koa-router');
const chatGroupController = require('../../controller/chatGroupController');

const router = new KoaRouter({ prefix: '/api/chat_group' });

// 创建群组
router.post('/create', chatGroupController.createChatGroup);

module.exports = router;