const KoaRouter = require('koa-router');
const contactController = require('../../controller/contact');

const router = new KoaRouter({ prefix: '/api/contact' });

// 添加联系人
router.post('/add', contactController.addContact);
// 查询和自己有关的好友申请工单，无论自己是申请人还是验证人
router.get('/get/apply_contact_ticket_list', contactController.getApplyContactTicketList);

module.exports = router;