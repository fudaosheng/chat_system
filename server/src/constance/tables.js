// 公共的数据库字段
const COMMON_TABLE_FIELDS = {
  ID: 'id',
  CREATE_TIME: 'create_time',
  UPDATE_TIME: 'update_time',
};

// 数据库表名
const TABLE_NAMES = {
  USERS: 'users', //用户表
  IMGS: 'imgs', // 图片资源表
  CONTACT_GROUP: 'contact_group', // 联系人分组表
  APPLY_CONTACT_TICKET: 'apply_contact_ticket', //申请好友工单表
  CONTACTS: 'contacts', //好友关系表
  OFFLINE_MESSAGES: 'offline_messages', //好友离线消息列表
  USER_IMGS: 'user_imgs', //用户图片
  CHAT_GROUPS: 'chat_groups', //会话组
  CHAT_GROUP_APPLY_TICKETS: 'chat_group_apply_tickets',// 群组申请工单
  CHAT_GROUP_CONTACTS: 'chat_group_contacts', //群组成员表
  MOMENTS: 'moments', //动态表
};

// 图片表
const IMGS_TABLE = {
  ...COMMON_TABLE_FIELDS,
  ID: 'id',
  FILENAME: 'filename',
  MIMETYPE: 'mimetype',
  SIZE: 'size',
  ENCODING: 'encoding',
};
// 用户图片表
const USER_IMGS_TABLE = {
  ...IMGS_TABLE,
  USER_ID: 'user_id',
};

// user表字段
const USER_TABLE = {
  ...COMMON_TABLE_FIELDS,
  ID: 'id',
  NAME: 'name',
  PASSWORD: 'password',
  BIRTHDAY: 'birthday',
  SEX: 'sex',
  PHONE_NUM: 'phone_num',
  AVATAR: 'avatar',
  BIO: 'bio',
};

// 分组表字段
const CONTACT_GROUP_TABLE = {
  ...COMMON_TABLE_FIELDS,
  ID: 'id',
  NAME: 'name',
  USER_ID: 'user_id',
};

// 申请好友工单表
const APPLY_CONTACT_TICKET_TABLE = {
  ...COMMON_TABLE_FIELDS,
  ID: 'id',
  APPLICANT_USER_ID: 'applicant_user_id',
  TARGET_USER_ID: 'target_user_id',
  STATUS: 'status',
  MESSAGE: 'message',
  NOTE: 'note', // 好友备注
  GROUP_ID: 'group_id',
};

// 申请好友的工单状态，默认值1。1等待处理、2申请同意、3申请拒绝
const APPLY_CONTACT_TICKET_STATUS = {
  PENDING: 1,
  AGREE: 2,
  DISAGREE: 3,
};

//好友关系表
const CONTACTS_TABLE = {
  ...COMMON_TABLE_FIELDS,
  ID: 'id',
  USER_ID: 'user_id',
  GROUP_ID: 'group_id',
  CONTACT_ID: 'contact_id',
  NOTE: 'note', // 好友备注
};
// 离线消息表
const OFFLINE_MESSAGE_TABLE = {
  ID: 'id',
  FROM_ID: 'fromId',
  RECEIVER_ID: 'receiverId',
  CHAT_ID: 'chatId',
  MESSAGE: 'message',
  TYPE: 'type',
  TIME: 'time',
  CHAT_TYPE: 'chatType'
};
// 群聊表
const CHAT_GROUPS_TABLE = {
  ...COMMON_TABLE_FIELDS,
  ID: 'id',
  NAME: 'name',
  ANNOUNCEMENT: 'announcement',
  OWNER_ID: 'owner_id',
  AVATAR: 'avatar'
}
// 群聊申请工单
const CHAT_GROUP_APPLY_TICKETS_TABLE = {
  ...COMMON_TABLE_FIELDS,
  ID: 'id',
  APPLICANT_USER_ID: 'applicant_user_id',
  TARGET_USER_ID: 'target_user_id',
  OPAERATOR_ID: 'operator_id', //处理人id
  STATUS: 'status',
  GROUP_ID: 'group_id',
}
// 群聊申请的工单状态，默认值1。1等待处理、2申请同意、3申请拒绝
const CHAT_GROUP_APPLY_TICKET_STATUS = {
  PENDING: 1,
  AGREE: 2,
  DISAGREE: 3,
};
// 群身份登里
const IDENTIRY_LEVEL = {
  OWNER: 1, //群组
  MANAGER: 2, //管理员
  DEFAULT: 3 
}
// 群聊成员表
const CHAT_GROUP_CONTACTS_TABLE = {
  ...COMMON_TABLE_FIELDS,
  GROUP_ID: 'group_id',
  USER_ID: 'user_id',
  IDENTITY: 'identity',
  NOTE: 'note'
}
// 动态表
const MOMENTS_TABLE = {
  ...COMMON_TABLE_FIELDS,
  CONTENT: 'content',
  IMGS_LIST: 'imgs_list',
  USER_ID: 'user_id',
}
module.exports = {
  TABLE_NAMES,
  USER_TABLE,
  CONTACT_GROUP_TABLE,
  APPLY_CONTACT_TICKET_TABLE,
  APPLY_CONTACT_TICKET_STATUS,
  CONTACTS_TABLE,
  COMMON_TABLE_FIELDS,
  OFFLINE_MESSAGE_TABLE,
  IMGS_TABLE,
  USER_IMGS_TABLE,
  CHAT_GROUPS_TABLE,
  CHAT_GROUP_APPLY_TICKETS_TABLE,
  CHAT_GROUP_CONTACTS_TABLE,
  CHAT_GROUP_APPLY_TICKET_STATUS,
  IDENTIRY_LEVEL,
  MOMENTS_TABLE
};
