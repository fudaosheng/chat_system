const jwt = require("jsonwebtoken");
const { STATUS_CODE } = require("../constance");
const { PUBLIC_KEY } = require("../constance/keys");
const noNeedAuthenticationPath = ["/user/login", "/user/registry"];

const authentication = async (ctx, next) => {
  const { url } = ctx.request;
  if (noNeedAuthenticationPath.some((path) => url.includes(path))) {
    await next();
  } else {
    const { authorization } = ctx.request.header;
    const token = authorization.replace("Bearer ", "");
    try {
      const user = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
      ctx.user = user;
      await next();
    } catch (err) {
      return ctx.makeResp({
        code: STATUS_CODE.UNAUTHORIZED,
        message: "unauthorized",
      });
    }
  }
};

module.exports = authentication;
