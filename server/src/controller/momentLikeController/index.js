const { STATUS_CODE } = require('../../constance');
const { TABLE_NAMES, MOMENT_LIKE_TABLE } = require('../../constance/tables');

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
}

module.exports = new MomentLikeScontroller();