const { STATUS_CODE, SORT_TYPE } = require('../../constance');
const connections = require('../../app/database');
const {
  TABLE_NAMES,
  APPLY_CONTACT_TICKET_TABLE,
  APPLY_CONTACT_TICKET_STATUS,
  USER_TABLE,
  CONTACTS_TABLE,
} = require('../../constance/tables');
const { getJSONOBJECTColumns, getTableSelectColumns } = require('../../utils');
class ContactController {
  // 添加联系人
  async addContact(ctx) {
    const { userId: targetUserId, group_id, message } = ctx.request.body;
    const { userId } = ctx.user;

    // 查询申请人和添加人是否已存在待处理的申请工单，如果已存在则不能重复申请
    const queryCondition = {
      [APPLY_CONTACT_TICKET_TABLE.APPLICANT_USER_ID]: userId, // 申请人
      [APPLY_CONTACT_TICKET_TABLE.TARGET_USER_ID]: targetUserId, // 要添加的人
      [APPLY_CONTACT_TICKET_TABLE.STATUS]: APPLY_CONTACT_TICKET_STATUS.PENDING, // 工单状态,默认值1。1等待处理、2申请同意、3申请拒绝
    };
    const applyTicket = await ctx.service.dbService.query(queryCondition, TABLE_NAMES.APPLY_CONTACT_TICKET);
    console.log('applyTicket', applyTicket);
    if (applyTicket.length) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, message: '已发送过好友申请，请耐心等待' });
    }
    // 在好友表中查询是否申请人和添加人已是好友关系，如果已是则不能添加
    const contactQueryCondition = {
      [CONTACTS_TABLE.USER_ID]: userId,
      [CONTACTS_TABLE.CONTACT_ID]: targetUserId
    }
    const contactList = await ctx.service.dbService.query(contactQueryCondition, TABLE_NAMES.CONTACTS);
    if (contactList.length) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, message: '已是好友关系，不能再次申请' });
    }
    // 向数据库新插入一条申请记录
    const ticket = {
      ...queryCondition,
      [APPLY_CONTACT_TICKET_TABLE.GROUP_ID]: group_id, // 添加的分组
      [APPLY_CONTACT_TICKET_TABLE.MESSAGE]: message, // 申请信息
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
  async getTicketList(ctx) {
    const { pageSize, currentPage } = ctx.request.query;
    const { userId } = ctx.user;
    // 分页偏移量
    const offset = (currentPage - 1) * pageSize;

    // 好友申请表
    const TICKETS = TABLE_NAMES.APPLY_CONTACT_TICKET;
    // 用户表
    const { USERS } = TABLE_NAMES;
    const { APPLICANT_USER_ID, TARGET_USER_ID } = APPLY_CONTACT_TICKET_TABLE;
    // 申请好友表中要查找的列
    const ticketTableSelectColumns = getTableSelectColumns(
      Object.values(APPLY_CONTACT_TICKET_TABLE)?.filter(k => ![APPLICANT_USER_ID, TARGET_USER_ID].includes(k)),
      TICKETS
    );
    // user表中选择的列
    const userTableSelectColumns = Object.values(USER_TABLE).filter(k => k !== USER_TABLE.PASSWORD);

    // 查询数据的条件
    const queryCondition = `${TICKETS}.applicant_user_id = ${userId} || ${TICKETS}.target_user_id = ${userId}`;

    // 通过左连接将好友申请表和用户信息连接起来，然后根据申请工单更新时间排序，之后进行分组
    const SQL = `SELECT ${ticketTableSelectColumns}, 
    JSON_OBJECT(${getJSONOBJECTColumns(userTableSelectColumns, 'tarUser')}) target_user, 
    JSON_OBJECT(${getJSONOBJECTColumns(userTableSelectColumns, 'appUser')}) applicant_user
    FROM ${TICKETS} LEFT JOIN ${USERS} as tarUser ON ${TICKETS}.target_user_id = tarUser.id 
      LEFT JOIN ${USERS} as appUser ON ${TICKETS}.applicant_user_id = appUser.id 
      WHERE ${queryCondition}
      ORDER BY ${TICKETS}.update_time DESC LIMIT ${offset}, ${pageSize};`;

    // 查询总共有多少条数据
    const totalQuerySQL = `SELECT COUNT(*) as total FROM ${TICKETS} WHERE ${queryCondition}`;

    // 一起查询，性能优化
    const [totalResp, ticketsResp] = await Promise.all([connections.execute(totalQuerySQL), connections.execute(SQL)]);

    return ctx.makeResp({
      code: STATUS_CODE.SUCCESS,
      data: {
        applyTicketList: ticketsResp[0],
        total: totalResp[0][0].total,
      },
    });
  }
  // 查询别人发给自己的待处理好友申请工单,不包含详细的用户信息
  async getApplyTicket(ctx) {
    const { userId } = ctx.user;
    // 查询为处理工单，以更新时间倒序
    const result = await ctx.service.dbService.query(
      {
        [APPLY_CONTACT_TICKET_TABLE.TARGET_USER_ID]: userId,
        [APPLY_CONTACT_TICKET_TABLE.STATUS]: APPLY_CONTACT_TICKET_STATUS.PENDING, // 为处理工单
      },
      TABLE_NAMES.APPLY_CONTACT_TICKET,
      {
        orderBy: [APPLY_CONTACT_TICKET_TABLE.UPDATE_TIME, SORT_TYPE.DESC],
      }
    );
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result });
  }
  // 拒绝添加好友
  async disagreeApplyContact(ctx) {
    const { id } = ctx.request.body;
    // 将好友申请表中id = id的工单状态置为拒绝状态
    const result = await ctx.service.dbService.update(
      { [APPLY_CONTACT_TICKET_TABLE.STATUS]: APPLY_CONTACT_TICKET_STATUS.DISAGREE },
      { id },
      TABLE_NAMES.APPLY_CONTACT_TICKET
    );
    return ctx.makeResp({ code: result.affectedRows ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR });
  }
  // 同意添加好友
  async agreeApplyContact(ctx) {
    const { apply_contact_ticketId, group_id, note } = ctx.request.body;
    const { USER_ID, GROUP_ID, CONTACT_ID, NOTE } = CONTACTS_TABLE;
    // 根据id查询好友申请工单详细信息
    const result = await ctx.service.dbService.query(
      { [APPLY_CONTACT_TICKET_TABLE.ID]: apply_contact_ticketId },
      TABLE_NAMES.APPLY_CONTACT_TICKET
    );
    // 好友申请工单
    const applyTicket = result[0];
    // 同意人，同意人及为验证者，contact_id为申请人
    const { applicant_user_id, target_user_id } = applyTicket;
    console.log('applyTicket', applyTicket);
    // 添加申请人好友关系
    const applicantContactRecord = {
      [USER_ID]: applicant_user_id,
      [GROUP_ID]: applyTicket.group_id,
      [CONTACT_ID]: target_user_id,
    };
    // 添加验证人好友关系
    const targetUserContactRecord = {
      [USER_ID]: target_user_id,
      [GROUP_ID]: group_id,
      [CONTACT_ID]: applicant_user_id,
      [NOTE]: note,
    };

    console.log('applicantContactRecord', applicantContactRecord);
    console.log('targetUserContactRecord', targetUserContactRecord);
    // 同时写入数据，添加好友成功
    const addResult = await Promise.all([
      ctx.service.dbService.insert(applicantContactRecord, TABLE_NAMES.CONTACTS),
      ctx.service.dbService.insert(targetUserContactRecord, TABLE_NAMES.CONTACTS),
      ctx.service.dbService.update(
        // 更新好友申请工单状态
        { [APPLY_CONTACT_TICKET_TABLE.STATUS]: APPLY_CONTACT_TICKET_STATUS.AGREE },
        { id: apply_contact_ticketId },
        TABLE_NAMES.APPLY_CONTACT_TICKET
      ),
    ]);
    console.log(addResult);
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS });
  }
}

module.exports = new ContactController();
