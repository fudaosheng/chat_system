const { STATUS_CODE } = require('../../constance');
const { CHAT_GROUPS_TABLE, TABLE_NAMES } = require('../../constance/tables');

class ChatGroupController {
  async createChatGroup(ctx) {
    const { name, avatar } = ctx.request.body;
    const ownerId = ctx.user.userId;
    try {
      // 创建群组
      await ctx.service.dbService.insert(
        { [CHAT_GROUPS_TABLE.NAME]: name, [CHAT_GROUPS_TABLE.AVATAR]: avatar, [CHAT_GROUPS_TABLE.OWNER_ID]: ownerId },
        TABLE_NAMES.CHAT_GROUPS
      );
      return ctx.makeResp({ code: STATUS_CODE.SUCCESS });
    } catch (err) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, message: JSON.stringify(err) });
    }
  }
}

module.exports = new ChatGroupController();