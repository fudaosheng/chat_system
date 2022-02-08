const { CHAT_GROUP_CONTACTS_TABLE, TABLE_NAMES } = require('../../constance/tables');
const connections = require('../../app/database');
const dbService = require('../dbService');

class ChatGroupContactService {
  // 获取群成员的userID列表
  async getChatGroupMemberIds(chatGroupId) {
    const SQL = `SELECT user_id id FROM ${TABLE_NAMES.CHAT_GROUP_CONTACTS} WHERE group_id = ${chatGroupId};`
    return connections.execute(SQL);
  }
}

module.exports = new ChatGroupContactService();
