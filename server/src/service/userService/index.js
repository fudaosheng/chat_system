const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../../constance/keys');
const { USER_TABLE, TABLE_NAMES } = require('../../constance/tables');
const dbService = require('../dbService');
const expires = 60 * 60 * 24 * 30; // token过期时间：一个月
class UserServer {
  generateToken(encryptionUserInfo) {
    return jwt.sign(encryptionUserInfo, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: expires });
  }
  async getUserInfoById(uid) {
    const result = await dbService.query({ [USER_TABLE.ID]: uid }, TABLE_NAMES.USERS);
    return result[0];
  }
}

module.exports = new UserServer();
