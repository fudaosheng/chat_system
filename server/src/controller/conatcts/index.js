const { CONTACT_GROUP_TABLE, TABLE_NAMES, CONTACTS_TABLE, USER_TABLE } = require('../../constance/tables');
const { getTableSelectColumns, getJSONOBJECTColumns, userTableCommonColumns } = require('../../utils');
const connections = require('../../app/database');
const { STATUS_CODE } = require('../../constance');

/**
 * 联系人Controller
 * @auther fudaosheng
 */
class ContactsController {
  // 获取用户的好友信息
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
      `${getJSONOBJECTColumns(userTableCommonColumns, TABLE_NAMES.USERS)
      }, ` +
      '\'note\', ' +
      `${CONTACTS}.${CONTACTS_TABLE.NOTE}`;

    // 查询SQL语句
    const SQL = `SELECT ${contactGroupTableSelectColumns}, JSON_ARRAYAGG(JSON_OBJECT(${userTableSelectColumns})) contact_list FROM ${CONTACTS} JOIN ${CONTACT_GROUP} ON ${CONTACTS}.${CONTACTS_TABLE.GROUP_ID} = ${CONTACT_GROUP}.${CONTACT_GROUP_TABLE.ID} 
	    JOIN ${USERS} ON ${CONTACTS}.${CONTACTS_TABLE.CONTACT_ID} = ${USERS}.${USER_TABLE.ID} WHERE ${CONTACTS}.${CONTACTS_TABLE.USER_ID} = ${userId} GROUP BY ${CONTACTS}.${CONTACTS_TABLE.GROUP_ID}`;
    const result = await connections.execute(SQL);

    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result[0] });
  }
}

module.exports = new ContactsController();
