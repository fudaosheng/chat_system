const { STATUS_CODE } = require('../../constance');
const connections = require('../../app/database');
const {
  TABLE_NAMES,
  APPLY_CONTACT_TICKET_TABLE,
  APPLY_CONTACT_TICKET_STATUS,
  USER_TABLE,
} = require('../../constance/tables');
const { getJSONOBJECTColumns, getTableSelectColumns } = require('../../utils');
class ContactController {
  // 添加联系人
  async addContact(ctx) {
    const { userId: targetUserId, group_id, message } = ctx.request.body;
    const userId = ctx.user.userId;

    // 查询申请人和添加人是否已存在待处理的申请工单，如果已存在则不能重复申请
    const queryCondition = {
      [APPLY_CONTACT_TICKET_TABLE.APPLICANT_USER_ID]: userId, // 申请人
      [APPLY_CONTACT_TICKET_TABLE.TARGET_USER_ID]: targetUserId, // 要添加的人
      [APPLY_CONTACT_TICKET_TABLE.STATUS]: APPLY_CONTACT_TICKET_STATUS.PENDING, //工单状态,默认值1。1等待处理、2申请同意、3申请拒绝
    };
    const applyTicket = await ctx.service.dbService.query(queryCondition, TABLE_NAMES.APPLY_CONTACT_TICKET);
    console.log('applyTicket', applyTicket);
    if (applyTicket.length) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, message: '已发送过好友申请，请耐心等待' });
    }
    // 向数据库新插入一条申请记录
    const ticket = {
      ...queryCondition,
      [APPLY_CONTACT_TICKET_TABLE.GROUP_ID]: group_id, //添加的分组
      [APPLY_CONTACT_TICKET_TABLE.MESSAGE]: message, //申请信息
    };
    console.log('ticket', ticket);
    const result = await ctx.service.dbService.insert(ticket, TABLE_NAMES.APPLY_CONTACT_TICKET);
    return ctx.makeResp({ code: result.insertId ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR });
  }
  // 查询自己发出的好友申请
  /**
   *
   * @param {*} request {
   *    pageSize: 一页多少条,
   *    currentPage: 当前的页码,
   * }
   *
   * response {
   *    total: 总共有多少条数据
   *    data: Array<ticket> 工单列表
   * }
   */
  async getApplyContactTicketList(ctx) {
    const { pageSize, currentPage } = ctx.request.query;
    const userId = ctx.user.userId;
    // 分页偏移量
    const offset = (currentPage - 1) * pageSize;

    // 好友申请表
    const TICKETS = TABLE_NAMES.APPLY_CONTACT_TICKET;
    // 用户表
    const USERS = TABLE_NAMES.USERS;
    const { APPLICANT_USER_ID, TARGET_USER_ID } = APPLY_CONTACT_TICKET_TABLE;
    // 申请好友表中要查找的列
    const ticketTableSelectColumns = getTableSelectColumns(Object.values(APPLY_CONTACT_TICKET_TABLE)?.filter(k => ![APPLICANT_USER_ID, TARGET_USER_ID].includes(k)), TICKETS);
    // user表中选择的列
    const userTableSelectColumns = Object.values(USER_TABLE).filter(k => k !== USER_TABLE.PASSWORD);

    // 通过左连接将好友申请表和用户信息连接起来，然后根据申请工单更新时间排序，之后进行分组
    const SQL = `SELECT ${ticketTableSelectColumns}, 
    JSON_OBJECT(${getJSONOBJECTColumns(userTableSelectColumns, 'tarUser')}) target_user, 
    JSON_OBJECT(${getJSONOBJECTColumns(userTableSelectColumns, 'appUser')}) applicant_user
    FROM ${TICKETS} LEFT JOIN ${USERS} as tarUser ON ${TICKETS}.target_user_id = tarUser.id 
      LEFT JOIN ${USERS} as appUser ON ${TICKETS}.applicant_user_id = appUser.id 
      WHERE ${TICKETS}.applicant_user_id = ${userId} || ${TICKETS}.target_user_id = ${userId}
      ORDER BY ${TICKETS}.update_time DESC LIMIT ${offset}, ${pageSize};`;

    console.log('查询申请列表SQL:', SQL);
    const result = await connections.execute(SQL);
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result[0] })
  }
}

module.exports = new ContactController();
