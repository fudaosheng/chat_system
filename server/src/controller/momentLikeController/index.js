const connections = require('../../app/database');
const { STATUS_CODE } = require('../../constance');
const { TABLE_NAMES, MOMENT_LIKE_TABLE, MOMENTS_TABLE } = require('../../constance/tables');
const { getTableSelectColumns, userTableCommonColumns } = require('../../utils');

class MomentLikeScontroller {
  // 删除喜欢
  async deleteLike(ctx) {
    const userId = ctx.user.userId;
    const { momentId, momentType } = ctx.request.body;

    await ctx.service.dbService.delete(
      {
        [MOMENT_LIKE_TABLE.USER_ID]: userId,
        [MOMENT_LIKE_TABLE.MOMENT_ID]: momentId,
        [MOMENT_LIKE_TABLE.MOMENT_TYPE]: momentType,
      },
      TABLE_NAMES.MOMENT_LIKE
    );
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS });
  }
  // 喜欢动态
  async like(ctx) {
    const userId = ctx.user.userId;
    const { momentId, momentType } = ctx.request.body;

    await ctx.service.dbService.insert(
      {
        [MOMENT_LIKE_TABLE.USER_ID]: userId,
        [MOMENT_LIKE_TABLE.MOMENT_ID]: momentId,
        [MOMENT_LIKE_TABLE.MOMENT_TYPE]: momentType,
      },
      TABLE_NAMES.MOMENT_LIKE
    );
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS });
  }
  // 获取自己是否喜欢该动态
  async getMomentLikeStatus(ctx) {
    const { momentId, momentType } = ctx.request.query;
    const userId = ctx.user.userId;

    const result = await ctx.service.dbService.query(      {
      [MOMENT_LIKE_TABLE.USER_ID]: userId,
      [MOMENT_LIKE_TABLE.MOMENT_ID]: momentId,
      [MOMENT_LIKE_TABLE.MOMENT_TYPE]: momentType,
    }, TABLE_NAMES.MOMENT_LIKE);

    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result });
  }
  // 根据用户的User ID和动态发布者的User ID查找两者公共的点赞用户列表
  async getCommenLikeUserList(ctx) {
    const userId = ctx.user.userId;
    const { momentId } = ctx.request.query;

    // 根据动态ID查询用户的好友中对这条动态点赞的用户列表
    const SQL = `SELECT ${getTableSelectColumns(userTableCommonColumns)}, contacts.note note
                   FROM users 
                   LEFT JOIN moment_like ON users.id = moment_like.user_id 
                   LEFT JOIN contacts ON users.id = contacts.contact_id
                   WHERE moment_like.moment_id = ${momentId} AND contacts.user_id = ${userId}`;

    // 分别查询用户和
    const [result] = await connections.execute(SQL);
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result });
  }
}

module.exports = new MomentLikeScontroller();
