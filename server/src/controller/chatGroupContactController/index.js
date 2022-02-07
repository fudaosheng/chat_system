const { STATUS_CODE } = require('../../constance');
const { CHAT_GROUP_CONTACTS_TABLE, TABLE_NAMES } = require('../../constance/tables');

/**
 * 群聊联系人controller
 * @auther fudaosheng
 */
class ChatGroupContactController {
  // 修改群名片
  async modityChatGroupNote(ctx) {
    const { id, note } = ctx.request.body;
    const userId = ctx.user.userId;

    await ctx.service.dbService.update(
      { note },
      { [CHAT_GROUP_CONTACTS_TABLE.GROUP_ID]: id, [CHAT_GROUP_CONTACTS_TABLE.USER_ID]: userId },
      TABLE_NAMES.CHAT_GROUP_CONTACTS
    );
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS });
  }
}

module.exports = new ChatGroupContactController();
