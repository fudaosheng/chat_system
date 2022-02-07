const { STATUS_CODE } = require('../constance');
const { CHAT_GROUP_CONTACTS_TABLE, TABLE_NAMES, IDENTIRY_LEVEL } = require('../constance/tables');

/**
 * 群聊权限效验，只有拥有该群的owner或管理权限才能通过
 * @param {*} ctx
 * @param {*} next
 */
const chatGroupCheckPermission = async (ctx, next) => {
  const userId = ctx.user.userId;
  // 群id
  const { id } = ctx.request.body || ctx.request.query;

  const result = await ctx.service.dbService.query(
    { [CHAT_GROUP_CONTACTS_TABLE.GROUP_ID]: id, [CHAT_GROUP_CONTACTS_TABLE.USER_ID]: userId },
    TABLE_NAMES.CHAT_GROUP_CONTACTS
  );
  // 权限效验通过
  if ([IDENTIRY_LEVEL.OWNER, IDENTIRY_LEVEL.MANAGER].includes(Number(result[0]?.identity || -1))) {
    await next();
  } else {
    return ctx.makeResp({ code: STATUS_CODE.FORBIDDEN, message: '您没有操作权限' });
  }
};

module.exports = chatGroupCheckPermission;
