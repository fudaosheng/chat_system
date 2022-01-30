const { STATUS_CODE } = require('../../constance');
const { CHAT_GROUPS_TABLE, TABLE_NAMES } = require('../../constance/tables');

class ChatGroupController {
  async createChatGroup(ctx) {
    const { name, avatar } = ctx.request.body;
    const ownerId = ctx.user.userId;
    try {
      // 查询该用户是否已创建过相同名称的群组
      const result = await ctx.service.dbService.query(
        { [CHAT_GROUPS_TABLE.OWNER_ID]: ownerId, [CHAT_GROUPS_TABLE.NAME]: name },
        TABLE_NAMES.CHAT_GROUPS
      );

      // 重复，不能重复创建
      if (result && result.length) {
        return ctx.makeResp({ code: STATUS_CODE.ERROR, message: '已创建过同名的群组，不能重复创建' });
      }
      // 创建群组
      const chatGroup = await ctx.service.dbService.insert(
        { [CHAT_GROUPS_TABLE.NAME]: name, [CHAT_GROUPS_TABLE.AVATAR]: avatar, [CHAT_GROUPS_TABLE.OWNER_ID]: ownerId },
        TABLE_NAMES.CHAT_GROUPS
      );
      return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: {
        id: chatGroup.insertId,
        name,
        avatar
      } });
    } catch (err) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, message: JSON.stringify(err) });
    }
  }
}

module.exports = new ChatGroupController();
