const { TABLE_NAMES } = require('../../constance/tables');
const { encryption } = require('../../utils');

class UserController {
  async registryUser(ctx) {
    const { name, password } = ctx.request.body;
    const encryptionPassword = encryption(password);

    console.log(encryptionPassword.length);
    const result = await ctx.service.dbService.insert(
      {
        name,
        password: encryptionPassword,
      },
      TABLE_NAMES.USERS
    );
    console.log(result);
    ctx.body = 'registry';
    ctx.makeResp({ code: result.insertId !== undefined ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR });
  }
}

module.exports = new UserController();
