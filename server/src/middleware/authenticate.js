const jwt = require('jsonwebtoken');
require('colors');
const { STATUS_CODE } = require('../constance');
const { PUBLIC_KEY } = require('../constance/keys');
const noNeedAuthenticationPath = ['/user/login', '/user/registry', '/file/upload/img', '/file/get/img'];

const authenticate = async (ctx, next) => {
  const { url: rawUrl } = ctx.request;
  
  // 为了防止get请求query字符串中含有上面不需鉴权的字符串而绕过鉴权;
  const url = rawUrl.split('?')[0];

  // 不需要鉴权的接口
  if (noNeedAuthenticationPath.some(path => url.includes(path))) {
    await next();
  } else {
    // 需要对token鉴权的接口
    const { authorization } = ctx.request.header;
    if (!authorization) {
      return ctx.makeResp({
        code: STATUS_CODE.UNAUTHORIZED,
        message: 'unauthorized',
      });
    }

    const token = authorization.replace('Bearer ', '');
    try {
      const user = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
      ctx.user = user;
    } catch (err) {
      console.log(`unauthorized: ${JSON.stringify(err)}`.red);
      return ctx.makeResp({
        code: STATUS_CODE.UNAUTHORIZED,
        message: 'unauthorized',
      });
    }

    // next不能卸载try里面，否则后续抛出的错误也会被catch到
    await next();
  }
};

module.exports = authenticate;
