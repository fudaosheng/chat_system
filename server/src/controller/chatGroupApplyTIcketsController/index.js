const { STATUS_CODE } = require('../../constance');
const {
  CHAT_GROUP_APPLY_TICKETS_TABLE,
  CHAT_GROUP_APPLY_TICKET_STATUS,
  TABLE_NAMES,
} = require('../../constance/tables');

class ChatGroupApplyTicketsController {
  async batchCreateApplyTickets(ctx) {
    const { groupId, userIdList: userIdListStr } = ctx.request.body;
    const applicantUserId = ctx.user.userId;
    // user id list
    const userIdList = typeof userIdListStr === 'string' ? userIdListStr.split(',') : userIdListStr;

    // 申请工单
    const ticket = {
      [CHAT_GROUP_APPLY_TICKETS_TABLE.APPLICANT_USER_ID]: applicantUserId,
      [CHAT_GROUP_APPLY_TICKETS_TABLE.GROUP_ID]: groupId,
      [CHAT_GROUP_APPLY_TICKETS_TABLE.STATUS]: CHAT_GROUP_APPLY_TICKET_STATUS.PENDING,
    };
    // 生成批量处理promise list
    const promiseList = (userIdList || []).map(id =>
      ctx.service.dbService.insert(
        { ...ticket, [CHAT_GROUP_APPLY_TICKETS_TABLE.TARGET_USER_ID]: id },
        TABLE_NAMES.CHAT_GROUP_APPLY_TICKETS
      )
    );

    // 向数据库插入数据
    try {
      await Promise.all(promiseList);
      return ctx.makeResp({ code: STATUS_CODE.SUCCESS });
    } catch (err) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, message: JSON.stringify(err) });
    }
  }
}

module.exports = new ChatGroupApplyTicketsController();