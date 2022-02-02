const connections = require('../../app/database');
const { STATUS_CODE } = require('../../constance');
const {
  CHAT_GROUP_APPLY_TICKETS_TABLE,
  CHAT_GROUP_APPLY_TICKET_STATUS,
  TABLE_NAMES,
  CHAT_GROUPS_TABLE,
} = require('../../constance/tables');
const { getTableSelectColumns, getJSONOBJECTColumns, userTableCommonColumns } = require('../../utils');

class ChatGroupApplyTicketsController {
  // 批量创建群组申请工单
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
  // 查询和自己相关的群组申请工单
  async getAllChatGroupApplyTickets(ctx) {
    const { userId } = ctx.user;

    // 用到的几个表
    const { CHAT_GROUPS, USERS, CHAT_GROUP_APPLY_TICKETS } = TABLE_NAMES;
    // chat_group_apply_tickets选中的列
    const chatGroupApplyTableSelectColumns = getTableSelectColumns(
      Object.values(CHAT_GROUP_APPLY_TICKETS_TABLE),
      TABLE_NAMES.CHAT_GROUP_APPLY_TICKETS
    );

    // 查询和自己相关的工单列表
    const SQL = `SELECT ${chatGroupApplyTableSelectColumns}, JSON_OBJECT(${getJSONOBJECTColumns(
      userTableCommonColumns
    )}) applicant_user, JSON_OBJECT(${getJSONOBJECTColumns(
      userTableCommonColumns,
      'tarUsers'
    )}) target_user, JSON_OBJECT(${getJSONOBJECTColumns(
      Object.values(CHAT_GROUPS_TABLE),
      TABLE_NAMES.CHAT_GROUPS
    )}) chat_group FROM ${CHAT_GROUP_APPLY_TICKETS} 
    JOIN ${USERS} ON ${CHAT_GROUP_APPLY_TICKETS}.${CHAT_GROUP_APPLY_TICKETS_TABLE.APPLICANT_USER_ID} = ${USERS}.id 
    JOIN ${USERS} as tarUsers ON ${CHAT_GROUP_APPLY_TICKETS}.${
      CHAT_GROUP_APPLY_TICKETS_TABLE.TARGET_USER_ID
    } = tarUsers.id 
    JOIN ${CHAT_GROUPS} ON ${CHAT_GROUP_APPLY_TICKETS}.${
      CHAT_GROUP_APPLY_TICKETS_TABLE.GROUP_ID
    } = ${CHAT_GROUPS}.id  WHERE ${CHAT_GROUP_APPLY_TICKETS_TABLE.APPLICANT_USER_ID} = ${userId} || ${
      CHAT_GROUP_APPLY_TICKETS_TABLE.TARGET_USER_ID
    } = ${userId};`;

    const result = await connections.execute(SQL);
    
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result[0] });
  }
}

module.exports = new ChatGroupApplyTicketsController();
