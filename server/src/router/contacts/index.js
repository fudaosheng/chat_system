const KoaRouter = require('koa-router');
const contactsController = require('../../controller/contactsController');

const router = new KoaRouter({ prefix: '/api/contacts' });

router.get('/get/contact_list', contactsController.getContactList);

// 批量查询用户的分组联系人信息
router.get('/get/contact_list_by_group_ids', contactsController.getContactListByGroupId);

// 获取联系人详细信息
router.get('/get/contact_info', contactsController.getContactInfo);
// 批量查询联系人详细信息
router.get('/get/bulk_contact_info', contactsController.getBulkContactInfoByIds);

// 编辑好友备注
router.post('/edit/contact_note', contactsController.editContactNote);

module.exports = router;