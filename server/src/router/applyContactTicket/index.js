const KoaRouter = require('koa-router');
const applyContactTicketController = require('../../controller/applyContactTicket');

const router = new KoaRouter({ prefix: '/api/apply_contact_ticket' });

// 添加联系人
router.post('/add', applyContactTicketController.addContact);
// 查询和自己有关的好友申请工单，无论自己是申请人还是验证人
router.get('/get/apply_contact_ticket_list', applyContactTicketController.getApplyContactTicketList);

module.exports = router;