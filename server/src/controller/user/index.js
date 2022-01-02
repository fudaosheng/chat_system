const { TABLE_NAMES } = require('../../constance/tables');
const { encryption } = require('../../utils');
const { STATUS_CODE } = require('../../constance');

class UserController {
  async registryUser(ctx) {
    const { name, password } = ctx.request.body;

    // 效验用户是否已存在
    const queryResult = await ctx.service.dbService.query({ name }, TABLE_NAMES.USERS);
    if(queryResult.length) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, message: '用户名已存在' });
    }

    // 对用户密码进行加密
    const encryptionPassword = encryption(password);

    // 调用database service向user表中插入用户信息
    const result = await ctx.service.dbService.insert(
      {
        name,
        password: encryptionPassword,
      },
      TABLE_NAMES.USERS
    );
    return ctx.makeResp({ code: result.insertId !== undefined ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR });
  }
  async login(ctx) {
    const { name, password } = ctx.request.body;

    // 调用database service查询用户信息
    const result = await ctx.service.dbService.query({ name }, TABLE_NAMES.USERS);
    const userInfo = result[0];

    // 根据user name 没用查找到用户信息，登陆失败;
    if(!userInfo) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, message: '用户不存在，请先注册' });
    }

    // 对用户密码进行加密
    const encryptionPassword = encryption(password);

    // 加密后密码和查询到用户密码不一样，登陆失败
    if(encryptionPassword !== userInfo.password) {
      return ctx.makeResp({ code: STATUS_CODE.ERROR, message: '登陆密码不正确' });
    }

    // 利用rsa256算法生成token
    const token = ctx.service.userService.generateToken({ name, password, userId: userInfo.id });

    // 将用户信息返回给前端，同时去掉密码信息
    delete userInfo.password;
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, message: '登陆成功', data: {
      ...userInfo,
      token
    } });
  } 
}

module.exports = new UserController();
