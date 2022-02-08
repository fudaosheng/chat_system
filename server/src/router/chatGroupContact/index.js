const KoaRouter = require('koa-router');
const chatGroupContactController = require('../../controller/chatGroupContactController');

const router = new KoaRouter({ prefix: '/api/chat_group_contact' });

// 修改群名片
router.post('/modify_chat_group_note', chatGroupContactController.modityChatGroupNote);

// 获取群成员
router.get('/get_members', chatGroupContactController.getChatGroupMembers);

module.exports = router;