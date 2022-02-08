const connections = require('../../app/database');
const { STATUS_CODE } = require('../../constance');
const { CHAT_GROUP_CONTACTS_TABLE, TABLE_NAMES } = require('../../constance/tables');
const { getTableSelectColumns, userTableCommonColumns } = require('../../utils');

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
  // 获取群成员
  async getChatGroupMembers(ctx) {
    // 群id
    const { id } = ctx.request.query;
    // 表
    const { USERS, CHAT_GROUP_CONTACTS } = TABLE_NAMES;

    // user表选择的列
    const userSelectColumns = getTableSelectColumns(userTableCommonColumns);
    // chat_group_contact选择的列
    const chatGroupSelectColumns = getTableSelectColumns([CHAT_GROUP_CONTACTS_TABLE.NOTE, CHAT_GROUP_CONTACTS_TABLE.IDENTITY], CHAT_GROUP_CONTACTS);

    // 查询SQL
    const SQL = `SELECT ${userSelectColumns}, ${chatGroupSelectColumns} FROM ${CHAT_GROUP_CONTACTS} JOIN ${USERS} ON ${CHAT_GROUP_CONTACTS}.user_id = ${USERS}.id WHERE ${CHAT_GROUP_CONTACTS}.group_id = ${id};`;
    const result = await connections.execute(SQL);

    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result[0] });
  }
}

module.exports = new ChatGroupContactController();
