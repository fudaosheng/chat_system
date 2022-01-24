const KoaRouter = require('koa-router');
const offlineMessageController = require('../../controller/offlineMessageController');

const router = new KoaRouter({ prefix: '/api/offline_message' });

router.get('/list', offlineMessageController.getOfflineMessageList);
// 删除所有离线消息
router.post('/delete/delete_all_offline_message', offlineMessageController.deleteAllOfflineMessage);

module.exports = router;