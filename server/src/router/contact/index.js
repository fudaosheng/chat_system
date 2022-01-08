const KoaRouter = require('koa-router');
const contactController = require('../../controller/contact');

const router = new KoaRouter({ prefix: '/api/contact' });

router.post('/add', contactController.addContact);

module.exports = router;