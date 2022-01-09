// 数据库表名
const TABLE_NAMES = {
  USERS: 'users', //用户表
  IMGS: 'imgs', // 图片资源表
  CONTACT_GROUP: 'contact_group', // 联系人分组表
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
  CONTACT_IDS: 'contact_ids',
  CREATE_TIME: 'create_time',
  UPDATE_TIME: 'update_time'
}

module.exports = {
  TABLE_NAMES,
  USER_TABLE,
  CONTACT_GROUP_TABLE
};
