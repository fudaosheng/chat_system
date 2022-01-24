const { OFFLINE_MESSAGE_TABLE, TABLE_NAMES } = require('../../constance/tables');
const { getJSONOBJECTColumns } = require('../../utils');
const connections = require('../../app/database');
const { STATUS_CODE } = require('../../constance');

class OfflineMessageController {
  // 获取离线消息列表
  async getOfflineMessageList(ctx) {
    const receiverId = ctx.user.userId;
    const { OFFLINE_MESSAGES } = TABLE_NAMES;
    const selectedOfflineMessageColumns = getJSONOBJECTColumns(Object.values(OFFLINE_MESSAGE_TABLE), OFFLINE_MESSAGES);

    const SQL = `SELECT ${OFFLINE_MESSAGE_TABLE.FROM_ID}, JSON_ARRAYAGG(JSON_OBJECT(${selectedOfflineMessageColumns})) messageList FROM ${OFFLINE_MESSAGES} 
        WHERE receiverId = ${receiverId} GROUP BY ${OFFLINE_MESSAGE_TABLE.FROM_ID};`;

    console.log('sql', SQL);

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
