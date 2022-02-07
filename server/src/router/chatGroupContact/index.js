const KoaRouter = require('koa-router');
const chatGroupContactController = require('../../controller/chatGroupContactController');

const router = new KoaRouter({ prefix: '/api/chat_group_contact' });

// 修改群名片
router.post('/modify_chat_group_note', chatGroupContactController.modityChatGroupNote);

module.exports = router;