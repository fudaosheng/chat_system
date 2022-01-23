const KoaRouter = require('koa-router');
const applyContactTicketController = require('../../controller/applyContactTicketController');

const router = new KoaRouter({ prefix: '/api/apply_contact_ticket' });

// 添加联系人
router.post('/add', applyContactTicketController.addContact);
// 拒绝添加好友
router.post('/reject_add_contact', applyContactTicketController.disagreeApplyContact);
//同意添加好友
router.post('/agree_add_contact', applyContactTicketController.agreeApplyContact);
// 查询和自己有关的好友申请工单，无论自己是申请人还是验证人
router.get('/get/ticket_list', applyContactTicketController.getTicketList);
// 查询别人发给自己的申请工单的数量
router.get('/get/apply_ticket_list', applyContactTicketController.getApplyTicket);


module.exports = router;
