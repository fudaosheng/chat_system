const KoaRouter = require('koa-router');
const chatGroupApplyTicketsController = require('../../controller/chatGroupApplyTIcketsController');

const router = new KoaRouter({ prefix: '/api/chat_group_apply_ticket' });

// 批量发送好友申请
router.post('/batch_create_tickets', chatGroupApplyTicketsController.batchCreateApplyTickets);

module.exports = router;