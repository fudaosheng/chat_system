const connections = require('../../app/database');
const { STATUS_CODE } = require('../../constance');
const {
  CHAT_GROUP_APPLY_TICKETS_TABLE,
  CHAT_GROUP_APPLY_TICKET_STATUS,
  TABLE_NAMES,
  CHAT_GROUPS_TABLE,
  CHAT_GROUP_CONTACTS_TABLE,
  IDENTIRY_LEVEL,
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

    // 分页参数
    const { pageSize, currentPage } = ctx.request.query;
    const offset = (currentPage - 1) * pageSize;

    // 用到的几个表
    const { CHAT_GROUPS, USERS, CHAT_GROUP_APPLY_TICKETS } = TABLE_NAMES;
    // chat_group_apply_tickets选中的列
    const chatGroupApplyTableSelectColumns = getTableSelectColumns(
      Object.values(CHAT_GROUP_APPLY_TICKETS_TABLE),
      TABLE_NAMES.CHAT_GROUP_APPLY_TICKETS
    );

    // 查询条件
    const queryCondition = `${CHAT_GROUP_APPLY_TICKETS_TABLE.APPLICANT_USER_ID} = ${userId} || ${CHAT_GROUP_APPLY_TICKETS_TABLE.TARGET_USER_ID} = ${userId} `;

    // 查询群聊申请工单数量SQL
    const totalSQL = `SELECT COUNT(*) as total FROM ${CHAT_GROUP_APPLY_TICKETS} WHERE ${queryCondition}`;

    // 查询和自己相关的工单列表的SQL
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
    JOIN ${CHAT_GROUPS} ON ${CHAT_GROUP_APPLY_TICKETS}.${CHAT_GROUP_APPLY_TICKETS_TABLE.GROUP_ID} = ${CHAT_GROUPS}.id  
    WHERE ${queryCondition}
    ORDER BY ${CHAT_GROUP_APPLY_TICKETS}.update_time DESC LIMIT ${offset}, ${pageSize};`;

    const [totalResp, ticketsResp] = await Promise.all([connections.execute(totalSQL), connections.execute(SQL)]);

    return ctx.makeResp({
      code: STATUS_CODE.SUCCESS,
      data: {
        applyTicketList: ticketsResp[0],
        total: totalResp[0][0].total,
      },
    });
  }
  // 查询待自己处理的工单
  async getApplyChatGroupTickets(ctx) {
    const userId = ctx.user.userId;

    const result = await ctx.service.dbService.query(
      { [CHAT_GROUP_APPLY_TICKETS_TABLE.TARGET_USER_ID]: userId },
      TABLE_NAMES.CHAT_GROUP_APPLY_TICKETS
    );

    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result });
  }
  // 同意入群
  async agreeApply(ctx) {
    const { ticketId } = ctx.request.body;
    const userId = ctx.user.userId;
    try {
      // 更新工单状态
      await ctx.service.dbService.update(
        { [CHAT_GROUP_APPLY_TICKETS_TABLE.STATUS]: CHAT_GROUP_APPLY_TICKET_STATUS.AGREE },
        { [CHAT_GROUP_APPLY_TICKETS_TABLE.ID]: ticketId, [CHAT_GROUP_APPLY_TICKETS_TABLE.TARGET_USER_ID]: userId },
        TABLE_NAMES.CHAT_GROUP_APPLY_TICKETS
      );

      // 获取工单信息
      const ticketDetail = await ctx.service.dbService.query(
        { [CHAT_GROUP_APPLY_TICKETS_TABLE.ID]: ticketId },
        TABLE_NAMES.CHAT_GROUP_APPLY_TICKETS
      );
      const { group_id, target_user_id } = ticketDetail[0];

      // 向群聊联系人表中插入信息
      await ctx.service.dbService.insert(
        {
          [CHAT_GROUP_CONTACTS_TABLE.GROUP_ID]: group_id,
          [CHAT_GROUP_CONTACTS_TABLE.USER_ID]: target_user_id,
          [CHAT_GROUP_CONTACTS_TABLE.IDENTITY]: IDENTIRY_LEVEL.DEFAULT,
        },
        TABLE_NAMES.CHAT_GROUP_CONTACTS
      );

      return ctx.makeResp({ code: STATUS_CODE.SUCCESS });
    } catch (err) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, data: JSON.stringify(err) });
    }
  }
  // 拒绝入群
  async disagreeApply(ctx) {
    const { ticketId } = ctx.request.body;
    const userId = ctx.user.userId;
    // 更新工单状态
    await ctx.service.dbService.update(
      { [CHAT_GROUP_APPLY_TICKETS_TABLE.STATUS]: CHAT_GROUP_APPLY_TICKET_STATUS.DISAGREE },
      { [CHAT_GROUP_APPLY_TICKETS_TABLE.ID]: ticketId, [CHAT_GROUP_APPLY_TICKETS_TABLE.TARGET_USER_ID]: userId },
      TABLE_NAMES.CHAT_GROUP_APPLY_TICKETS
    );
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS });
  }
}

module.exports = new ChatGroupApplyTicketsController();
