const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../../constance/keys');
const expires = 60 * 60 * 24 * 30; // token过期时间：一个月
class UserServer {
  generateToken(encryptionUserInfo) {
    return jwt.sign(encryptionUserInfo, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: expires });
  }
}

module.exports = UserServer;
