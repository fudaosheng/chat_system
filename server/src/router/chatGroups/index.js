const KoaRouter = require('koa-router');
const chatGroupController = require('../../controller/chatGroupController');

const router = new KoaRouter({ prefix: '/api/chat_group' });

// 创建群组
router.post('/create', chatGroupController.createChatGroup);

// 根据ID搜索群
router.get('/get_chat_group_list_by_id', chatGroupController.getChatGroupListById);

// 根据name模糊搜索群
router.get('/get_chat_group_list_by_name', chatGroupController.getChatGroupListByName);

module.exports = router;