const KoaRouter = require('koa-router');
const groupController = require('../../controller/group');

const router = new KoaRouter({ prefix: '/api/group' });

router.post('/create', groupController.createGroup);

module.exports = router;