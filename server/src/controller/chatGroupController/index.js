const { STATUS_CODE } = require('../../constance');
const connections = require('../../app/database');
const { CHAT_GROUPS_TABLE, TABLE_NAMES, CHAT_GROUP_CONTACTS_TABLE, IDENTIRY_LEVEL } = require('../../constance/tables');
const { getTableSelectColumns } = require('../../utils');

/**
 * 群聊controller
 * @auther fudaosheng
 */

class ChatGroupController {
  // 创建群聊
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

      // 向群成员表中插入群主身份
      await ctx.service.dbService.insert(
        {
          [CHAT_GROUP_CONTACTS_TABLE.GROUP_ID]: chatGroup.insertId, //群id
          [CHAT_GROUP_CONTACTS_TABLE.USER_ID]: ownerId,
          [CHAT_GROUP_CONTACTS_TABLE.IDENTITY]: IDENTIRY_LEVEL.OWNER,
        },
        TABLE_NAMES.CHAT_GROUP_CONTACTS
      );

      return ctx.makeResp({
        code: STATUS_CODE.SUCCESS,
        data: {
          id: chatGroup.insertId,
          name,
          avatar,
        },
      });
    } catch (err) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, message: JSON.stringify(err) });
    }
  }
  // 根据ID搜索群
  async getChatGroupById(ctx) {
    const { id } = ctx.request.query;
    const result = await ctx.service.dbService.query({ [CHAT_GROUPS_TABLE.ID]: id }, TABLE_NAMES.CHAT_GROUPS);
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result })
  }
  // 根据群名称模糊搜索群
  async getChatGroupListByName(ctx) {
    const { name } = ctx.request.query;
    const result = await ctx.service.dbService.query({ [CHAT_GROUPS_TABLE.NAME]: name }, TABLE_NAMES.CHAT_GROUPS, { isLikeQuery: true });
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result })
  }
  // 获取用户的群聊列表
  async getChatGroupList(ctx) {
    const userId = ctx.user.userId;
    const { CHAT_GROUP_CONTACTS, CHAT_GROUPS } = TABLE_NAMES;

    const columns = getTableSelectColumns(Object.values(CHAT_GROUPS_TABLE), TABLE_NAMES.CHAT_GROUPS);
    const SQL = `SELECT ${columns} FROM ${CHAT_GROUP_CONTACTS} JOIN ${CHAT_GROUPS} ON ${CHAT_GROUP_CONTACTS}.group_id = ${CHAT_GROUPS}.id WHERE user_id = ${userId};`;

    const result = await connections.execute(SQL);
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result[0] });
  }
}

module.exports = new ChatGroupController();
