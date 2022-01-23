const { TABLE_NAMES, USER_TABLE } = require('../../constance/tables');
const { encryption } = require('../../utils');
const { STATUS_CODE } = require('../../constance');

class UserController {
  async registryUser(ctx) {
    const { name, password } = ctx.request.body;

    // 效验用户是否已存在
    const queryResult = await ctx.service.dbService.query({ name }, TABLE_NAMES.USERS);
    if (queryResult.length) {
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
    return ctx.makeResp({
      code: result.insertId !== undefined ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR,
    });
  }
  async login(ctx) {
    const { name, password } = ctx.request.body;

    // 调用database service查询用户信息
    const result = await ctx.service.dbService.query({ name }, TABLE_NAMES.USERS);
    const userInfo = result[0];

    // 根据user name 没用查找到用户信息，登陆失败;
    if (!userInfo) {
      return ctx.makeResp({
        code: STATUS_CODE.ERROR,
        message: '用户不存在，请先注册',
      });
    }

    // 对用户密码进行加密
    const encryptionPassword = encryption(password);

    // 加密后密码和查询到用户密码不一样，登陆失败
    if (encryptionPassword !== userInfo.password) {
      return ctx.makeResp({
        code: STATUS_CODE.ERROR,
        message: '登陆密码不正确',
      });
    }

    // 利用rsa256算法生成token
    const token = ctx.service.userService.generateToken({
      name,
      password,
      userId: userInfo.id,
    });

    // 将用户信息返回给前端，同时去掉密码信息
    delete userInfo.password;
    return ctx.makeResp({
      code: STATUS_CODE.SUCCESS,
      message: '登陆成功',
      data: {
        ...userInfo,
        token,
      },
    });
  }
  async setUserAvatar(ctx) {
    const { avatar } = ctx.request.body;
    const result = await ctx.service.dbService.update({ avatar }, { id: ctx.user.userId }, TABLE_NAMES.USERS);

    return ctx.makeResp({
      code: result.affectedRows !== undefined ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR,
    });
  }
  // 设置个性签名
  async setUserBio(ctx) {
    const { bio } = ctx.request.body;
    const { userId } = ctx.user;

    // 调用database服务修改字段
    const result = await ctx.service.dbService.update({ bio }, { id: userId }, TABLE_NAMES.USERS);
    return ctx.makeResp({ code: result.affectedRows !== undefined ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR });
  }
  // 更新用户信息，可全部更新
  async updateUserInfo(ctx) {
    const { sex, birthday, phone_num, name, password, avatar, bio } = ctx.request.body;
    const _userInfo = { sex, birthday, phone_num, name, password, avatar, bio };
    const userInfo = {};
    // 对用户信息进行效验，过滤掉无效值，同时如果字段为密码需要进行加密
    for (let key in _userInfo) {
      const value = _userInfo[key];
      if (value === undefined || value === '') {
        continue;
      }
      userInfo[key] = value;
      if (key === 'password') {
        userInfo.password = encryption(value);
      }
    }
    console.log('update user info', userInfo);

    // 从context拿出userId
    const { userId } = ctx.user;
    const result = await ctx.service.dbService.update(userInfo, { id: userId }, TABLE_NAMES.USERS);
    return ctx.makeResp({ code: result.affectedRows !== undefined ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR });
  }
  // 根据name模糊搜索用户
  async getUserListByName(ctx) {
    const { name } = ctx.request.query;

    // 查询user列表
    const result = await ctx.service.dbService.query({ name }, TABLE_NAMES.USERS, {
      isLikeQuery: true,
      columns: Object.values(USER_TABLE).filter(col => col !== USER_TABLE.PASSWORD), // 设置要查询的列
    });

    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result });
  }
  // 根据用户ID精确搜索用户
  async getUserById(ctx) {
    const { id } = ctx.request.query;

    // 查询user列表
    const result = await ctx.service.dbService.query({ id }, TABLE_NAMES.USERS, {
      columns: Object.values(USER_TABLE).filter(col => col !== USER_TABLE.PASSWORD), // 设置要查询的列
    });

    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result });
  }
}

module.exports = new UserController();
