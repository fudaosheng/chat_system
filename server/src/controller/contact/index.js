const { STATUS_CODE } = require('../../constance');
const { TABLE_NAMES, APPLY_CONTACT_TICKET_TABLE, APPLY_CONTACT_TICKET_STATUS } = require('../../constance/tables');
class ContactController {
  // 添加联系人
  async addContact(ctx) {
    const { userId: targetUserId, group_id, message } = ctx.request.body;
    const userId = ctx.user.userId;

    // 查询申请人和添加人是否已存在待处理的申请工单，如果已存在则不能重复申请
    const queryCondition = {
      [APPLY_CONTACT_TICKET_TABLE.APPLICANT_USER_ID]: userId, // 申请人
      [APPLY_CONTACT_TICKET_TABLE.TARGET_USER_ID]: targetUserId, // 要添加的人
      [APPLY_CONTACT_TICKET_TABLE.STATUS]: APPLY_CONTACT_TICKET_STATUS.PENDING, //工单状态,默认值1。1等待处理、2申请同意、3申请拒绝
    };
    const applyTicket = await ctx.service.dbService.query(queryCondition, TABLE_NAMES.APPLY_CONTACT_TICKET);
    console.log('applyTicket', applyTicket);
    if (applyTicket.length) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, message: '已发送过好友申请，请耐心等待' });
    }
    // 向数据库新插入一条申请记录
    const ticket = {
      ...queryCondition,
      [APPLY_CONTACT_TICKET_TABLE.GROUP_ID]: group_id, //添加的分组
      [APPLY_CONTACT_TICKET_TABLE.MESSAGE]: message, //申请信息
    };
    console.log('ticket', ticket);
    const result = await ctx.service.dbService.insert(ticket, TABLE_NAMES.APPLY_CONTACT_TICKET);
    return ctx.makeResp({ code: result.insertId ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR });
  }
}

module.exports = new ContactController();
