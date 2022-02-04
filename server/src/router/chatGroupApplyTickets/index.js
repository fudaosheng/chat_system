const KoaRouter = require('koa-router');
const chatGroupApplyTIcketsController = require('../../controller/chatGroupApplyTIcketsController');
const chatGroupApplyTicketsController = require('../../controller/chatGroupApplyTIcketsController');

const router = new KoaRouter({ prefix: '/api/chat_group_apply_ticket' });

// 批量发送好友申请
router.post('/batch_create_tickets', chatGroupApplyTicketsController.batchCreateApplyTickets);

// 查询和自己相关的工单,无论是自己发出的还是待自己处理的
router.get('/get_all_related_tickets', chatGroupApplyTicketsController.getAllChatGroupApplyTickets);

// 查询待自己处理的申请工单
router.get('/get/chat_group_apply_tickets', chatGroupApplyTIcketsController.getApplyChatGroupTickets);

// 同意入群申请
router.post('/agree', chatGroupApplyTIcketsController.agreeApply);
// 拒绝入群申请
router.post('/disagree', chatGroupApplyTIcketsController.disagreeApply);

module.exports = router;