const KoaRouter = require('koa-router');
const offlineMessageController = require('../../controller/offlineMessageController');

const router = new KoaRouter({ prefix: '/api/offline_message' });

router.get('/list', offlineMessageController.getOfflineMessageList);

module.exports = router;