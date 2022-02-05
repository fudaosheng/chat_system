const { CHAT_GROUP_APPLY_TICKETS_TABLE, CHAT_GROUP_APPLY_TICKET_STATUS, TABLE_NAMES } = require('../../constance/tables');
const dbService = require('../dbService');

class ChatGroupApplyTicketService {
  // 创建申请工单
  /**
   * 
   * @param {*} groupId 
   * @param {*} applicantUserId 
   * @param {*} targetUserId 
   * @param {*} operatorId 可选参数，处理人
   * @returns 
   */
  async createApplyTicket(groupId, applicantUserId, targetUserId, operatorId) {
    // 查询申请人和添加人是否已存在待处理的申请工单，如果已存在则不能重复申请
    const ticket = {
      [CHAT_GROUP_APPLY_TICKETS_TABLE.APPLICANT_USER_ID]: applicantUserId,
      [CHAT_GROUP_APPLY_TICKETS_TABLE.GROUP_ID]: groupId,
      [CHAT_GROUP_APPLY_TICKETS_TABLE.TARGET_USER_ID]: targetUserId,
      [CHAT_GROUP_APPLY_TICKETS_TABLE.OPAERATOR_ID]: operatorId || targetUserId,
      [CHAT_GROUP_APPLY_TICKETS_TABLE.STATUS]: CHAT_GROUP_APPLY_TICKET_STATUS.PENDING,
    };
    // 查询是否已有待处理工单
    const applyTicket = await dbService.query(ticket, TABLE_NAMES.CHAT_GROUP_APPLY_TICKETS);
    console.log('applyTicket', applyTicket);

    if (applyTicket.length) {
      throw Error('已申请过，请耐心等待对方处理');
    }
    // 插入数据
    const result = await dbService.insert(
      { ...ticket, [CHAT_GROUP_APPLY_TICKETS_TABLE.TARGET_USER_ID]: targetUserId },
      TABLE_NAMES.CHAT_GROUP_APPLY_TICKETS
    );

    return result;
  }
}

module.exports = new ChatGroupApplyTicketService();
