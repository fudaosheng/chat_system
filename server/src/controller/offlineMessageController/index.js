const { OFFLINE_MESSAGE_TABLE, TABLE_NAMES } = require('../../constance/tables');
const { getJSONOBJECTColumns } = require('../../utils');
const connections = require('../../app/database');
const { STATUS_CODE, CHAT_TYPE } = require('../../constance');

class OfflineMessageController {
  // 获取单聊离线消息列表
  async getOfflineMessageList(ctx) {
    const receiverId = ctx.user.userId;
    const { OFFLINE_MESSAGES } = TABLE_NAMES;
    const selectedOfflineMessageColumns = getJSONOBJECTColumns(Object.values(OFFLINE_MESSAGE_TABLE), OFFLINE_MESSAGES);

    const SQL = `SELECT ${OFFLINE_MESSAGE_TABLE.FROM_ID} as chatId, JSON_ARRAYAGG(JSON_OBJECT(${selectedOfflineMessageColumns})) messageList FROM ${OFFLINE_MESSAGES} 
        WHERE receiverId = ${receiverId} AND chatType = '${CHAT_TYPE.CHAT}' GROUP BY ${OFFLINE_MESSAGE_TABLE.FROM_ID};`;

    const result = await connections.execute(SQL);

    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result[0] });
  }
  // 获取用户所有群聊的离线消息
  async getChatGroupOfflineMessageList(ctx) {
    const receiverId = ctx.user.userId;
    const { OFFLINE_MESSAGES } = TABLE_NAMES;
    const selectedOfflineMessageColumns = getJSONOBJECTColumns(Object.values(OFFLINE_MESSAGE_TABLE), OFFLINE_MESSAGES);

    const SQL = `SELECT ${OFFLINE_MESSAGE_TABLE.CHAT_ID}, JSON_ARRAYAGG(JSON_OBJECT(${selectedOfflineMessageColumns})) messageList FROM ${OFFLINE_MESSAGES} 
        WHERE receiverId = ${receiverId} AND chatType = '${CHAT_TYPE.CHAT_GROUP}' GROUP BY ${OFFLINE_MESSAGE_TABLE.CHAT_ID};`;

    const result = await connections.execute(SQL);

    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result[0] });
  }
  // 删除用户所有离线消息
  async deleteAllOfflineMessage(ctx) {
    const userId = ctx.user.userId;
    await ctx.service.dbService.delete({ [OFFLINE_MESSAGE_TABLE.RECEIVER_ID]: userId }, TABLE_NAMES.OFFLINE_MESSAGES);
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS });
  }
}

module.exports = new OfflineMessageController();
