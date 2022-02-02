const KoaRouter = require('koa-router');
const chatGroupApplyTicketsController = require('../../controller/chatGroupApplyTIcketsController');

const router = new KoaRouter({ prefix: '/api/chat_group_apply_ticket' });

// 批量发送好友申请
router.post('/batch_create_tickets', chatGroupApplyTicketsController.batchCreateApplyTickets);

// 查询和自己相关的工单
router.get('/get_all_related_tickets', chatGroupApplyTicketsController.getAllChatGroupApplyTickets);

module.exports = router;