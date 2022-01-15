// 数据库表名
const TABLE_NAMES = {
  USERS: 'users', //用户表
  IMGS: 'imgs', // 图片资源表
  CONTACT_GROUP: 'contact_group', // 联系人分组表
  APPLY_CONTACT_TICKET: 'apply_contact_ticket', //申请好友工单表
  CONTACTS: 'contacts', //好友关系表
};

// user表字段
const USER_TABLE = {
  ID: 'id',
  NAME: 'name',
  PASSWORD: 'password',
  BIRTHDAY: 'birthday',
  SEX: 'sex',
  PHONE_NUM: 'phone_num',
  AVATAR: 'avatar',
  BIO: 'bio'
}

// 分组表字段
const CONTACT_GROUP_TABLE = {
  ID: 'id',
  NAME: 'name',
  USER_ID: 'user_id',
  CREATE_TIME: 'create_time',
  UPDATE_TIME: 'update_time'
}

// 申请好友工单表
const APPLY_CONTACT_TICKET_TABLE = {
  ID: 'id',
  APPLICANT_USER_ID: 'applicant_user_id',
  TARGET_USER_ID: 'target_user_id',
  STATUS: 'status',
  MESSAGE: 'message',
  NOTE: 'note', // 好友备注
  GROUP_ID: 'group_id',
  CREATE_TIME: 'create_time',
  UPDATE_TIME: 'update_time'
}

// 申请好友的工单状态，默认值1。1等待处理、2申请同意、3申请拒绝
const APPLY_CONTACT_TICKET_STATUS = {
  PENDING: 1,
  AGREE: 2,
  DISAGREE: 3
}

//好友关系表
const CONTACTS_TABLE = {
  ID: 'id',
  USER_ID: 'user_id',
  GROUP_ID: 'group_id',
  CONTACT_ID: 'contact_id',
  NOTE: 'note',// 好友备注
  CREATE_TIME: 'create_time',
  UPDATE_TIME: 'update_time'
}

module.exports = {
  TABLE_NAMES,
  USER_TABLE,
  CONTACT_GROUP_TABLE,
  APPLY_CONTACT_TICKET_TABLE,
  APPLY_CONTACT_TICKET_STATUS,
  CONTACTS_TABLE
};
