const KoaRouter = require('koa-router');
const contactsController = require('../../controller/conatcts');

const router = new KoaRouter({ prefix: '/api/contacts' });

router.get('/get/contact_list', contactsController.getContactList);

module.exports = router;