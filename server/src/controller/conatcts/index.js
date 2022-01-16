const {
  CONTACT_GROUP_TABLE,
  TABLE_NAMES,
  CONTACTS_TABLE,
  USER_TABLE,
  COMMON_TABLE_FIELDS,
} = require('../../constance/tables');
const { getTableSelectColumns, getJSONOBJECTColumns, userTableCommonColumns } = require('../../utils');
const connections = require('../../app/database');
const { STATUS_CODE } = require('../../constance');

/**
 * 联系人Controller
 * @auther fudaosheng
 */
class ContactsController {
  // 获取用户的好友信息，包含分组信息及分组下联系人
  async getContactList(ctx) {
    // 从token中拿用户信息
    const { userId } = ctx.user;
    // 用到的几个表
    const { CONTACTS, CONTACT_GROUP, USERS } = TABLE_NAMES;
    // 分组表中选择的列
    const contactGroupTableSelectColumns = getTableSelectColumns(
      Object.values(CONTACT_GROUP_TABLE).filter(k => k !== CONTACT_GROUP_TABLE.USER_ID),
      TABLE_NAMES.CONTACT_GROUP
    );
    // 用户信息,包含备注信息
    const userTableSelectColumns =
      `${getJSONOBJECTColumns(userTableCommonColumns, TABLE_NAMES.USERS)}, ` +
      "'note', " +
      `${CONTACTS}.${CONTACTS_TABLE.NOTE}`;

    // 查询SQL语句
    const SQL = `SELECT ${contactGroupTableSelectColumns}, JSON_ARRAYAGG(JSON_OBJECT(${userTableSelectColumns})) contact_list FROM ${CONTACTS} JOIN ${CONTACT_GROUP} ON ${CONTACTS}.${CONTACTS_TABLE.GROUP_ID} = ${CONTACT_GROUP}.${CONTACT_GROUP_TABLE.ID} 
	    JOIN ${USERS} ON ${CONTACTS}.${CONTACTS_TABLE.CONTACT_ID} = ${USERS}.${USER_TABLE.ID} WHERE ${CONTACTS}.${CONTACTS_TABLE.USER_ID} = ${userId} GROUP BY ${CONTACTS}.${CONTACTS_TABLE.GROUP_ID}`;
    const result = await connections.execute(SQL);

    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result[0] });
  }
  // 批量查询用户分组下联系人信息
  async getContactListByGroupId(ctx) {
    const { group_id_list } = ctx.request.query;
    const { userId } = ctx.user;

    // 将string转成array，并对类型进行转换
    const groupIdList = group_id_list.split(',').map(v => Number(v));

    // 用到的几个表
    const { CONTACTS, USERS } = TABLE_NAMES;

    // 用户信息,包含备注信息
    const userTableSelectColumns =
      `${getTableSelectColumns(userTableCommonColumns, TABLE_NAMES.USERS)}, ` +
      "'note', " +
      `${CONTACTS}.${CONTACTS_TABLE.NOTE}`;

    const SQL = `SELECT ${userTableSelectColumns} FROM ${CONTACTS} 
    JOIN ${USERS} ON ${CONTACTS}.${CONTACTS_TABLE.CONTACT_ID} = ${USERS}.${USER_TABLE.ID} WHERE ${CONTACTS}.${CONTACTS_TABLE.USER_ID} = ${userId} AND ${CONTACTS}.group_id = 
  `;

    // 查询任务
    const promiseList = groupIdList.map(groupId => connections.execute(SQL + groupId));
    // 使用promise.all所有查询任务并行，提高性能
    const result = await Promise.all(promiseList);
    // 处理查询任务
    const data = groupIdList.map((groupId, index) => ({ groupId, contactList: result[index][0] }));
    console.log(data);
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data });
  }
  // 查询联系人详细信息
  async getContactInfo(ctx) {
    const { userId } = ctx.request.query;
    console.log('userId', userId);

    // 用到的几个表
    const { CONTACTS, USERS } = TABLE_NAMES;

    // 用户信息,包含备注信息, create_time好友创建时间，update_time好友更新时间
    const userTableSelectColumns = `${getTableSelectColumns(
      userTableCommonColumns.filter(v => !Object.values(COMMON_TABLE_FIELDS).includes(v)),
      TABLE_NAMES.USERS
    )}, ${getTableSelectColumns(
      [CONTACTS_TABLE.NOTE, CONTACTS_TABLE.CREATE_TIME, CONTACTS_TABLE.UPDATE_TIME],
      TABLE_NAMES.CONTACTS
    )}`;

    const SQL = `SELECT ${userTableSelectColumns} FROM ${CONTACTS} 
    JOIN ${USERS} ON ${CONTACTS}.${CONTACTS_TABLE.CONTACT_ID} = ${USERS}.${USER_TABLE.ID} WHERE ${CONTACTS}.${CONTACTS_TABLE.USER_ID} = ${ctx.user.userId} AND ${CONTACTS}.${CONTACTS_TABLE.CONTACT_ID} = ${userId}`;
    const result = await connections.execute(SQL);
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result[0][0] });
  }
  // 修改好友备注
  async editContactNote(ctx) {
    const { userId, note } = ctx.request.body;

    // 调用db服务，进行数据修改
    const result = await ctx.service.dbService.update(
      { note },
      { [CONTACTS_TABLE.USER_ID]: ctx.user.userId, [CONTACTS_TABLE.CONTACT_ID]: userId },
      TABLE_NAMES.CONTACTS
    );

    return ctx.makeResp({ code: result.affectedRows !== undefined ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR });
  }
}

module.exports = new ContactsController();
