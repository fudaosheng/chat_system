const KoaRouter = require('koa-router');
const contactGroupController = require('../../controller/contactGroup');

const router = new KoaRouter({ prefix: '/api/contact_group' });

router.post('/create', contactGroupController.createContactGroup);

// 查询分组
router.get('/get', contactGroupController.getContactGroupList);

module.exports = router;