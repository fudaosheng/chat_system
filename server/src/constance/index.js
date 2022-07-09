const path = require('path');
const { IMG_PATH } = require('../app/env');
/**
 * 请求状态吗
 */
const STATUS_CODE = {
  SUCCESS: 1,
  ERROR: 0,
  FIELD_LENGTH_ERROR: 2,
  PARAMS_TYPE_ERROR: 3,
  USER_ALREADY_EXIST: 4,
  PASSWORD_ERROR: 5,
  PARAMS_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

const SORT_TYPE = {
  DESC: 'DESC',
  ASC: 'ASC'
}

const imgUploadPath = path.resolve(IMG_PATH);
// 消息会话类型
const CHAT_TYPE = {
  CHAT: 'chat', // 单聊
  CHAT_GROUP: 'chatGroup', // 群聊
};

module.exports = {
  STATUS_CODE,
  imgUploadPath,
  SORT_TYPE,
  CHAT_TYPE
}