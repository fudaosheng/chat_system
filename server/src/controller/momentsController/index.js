const connections = require('../../app/database');
const { STATUS_CODE, SORT_TYPE } = require('../../constance');
const { TABLE_NAMES, MOMENTS_TABLE } = require('../../constance/tables');

class MomentController {
  // 创建动态
  async createMomemt(ctx) {
    const { content, imgs_list } = ctx.request.body;
    const userId = ctx.user.userId;

    // 动态
    const moment = {
      [MOMENTS_TABLE.USER_ID]: userId,
      [MOMENTS_TABLE.CONTENT]: content,
    };
    if (Array.isArray(imgs_list) && imgs_list.length) {
      moment[MOMENTS_TABLE.IMGS_LIST] = JSON.stringify(imgs_list);
    }

    await ctx.service.dbService.insert(moment, TABLE_NAMES.MOMENTS);

    return ctx.makeResp({ code: STATUS_CODE.SUCCESS });
  }
  async getUserMoments(ctx) {
    const userId = ctx.user.userId;
    const { currentPage, pageSize } = ctx.request.query;

    const totalSQL = `SELECT COUNT(*) as total FROM ${TABLE_NAMES.MOMENTS} WHERE user_id = ${userId}`;
    // 一次查询总数和用户动态
    const [resp1, resp2] = await Promise.all([
      connections.execute(totalSQL),
      ctx.service.dbService.query(
        {
          [MOMENTS_TABLE.USER_ID]: userId,
        },
        TABLE_NAMES.MOMENTS,
        {
          orderBy: [MOMENTS_TABLE.CREATE_TIME, SORT_TYPE.DESC],
          limit: Number(pageSize),
          offset: (Number(currentPage) - 1) * Number(pageSize),
        }
      ),
    ]);
    return ctx.makeResp({
      code: STATUS_CODE.SUCCESS,
      data: {
        list: resp2,
        total: resp1[0][0].total,
      },
    });
  }
}

module.exports = new MomentController();
