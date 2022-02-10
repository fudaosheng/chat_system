const connections = require('../../app/database');
const { STATUS_CODE, SORT_TYPE } = require('../../constance');
const { TABLE_NAMES, MOMENTS_TABLE } = require('../../constance/tables');
const { getTableSelectColumns, getJSONOBJECTColumns, userTableCommonColumns } = require('../../utils');

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
  // 获取用户的动态
  async getUserMoments(ctx) {
    const userId = ctx.user.userId;
    // 分页参数处理
    const { currentPage: _currentPage = 1, pageSize: _pageSize = 10 } = ctx.request.query;
    const currentPage = Number(_currentPage);
    const pageSize = Number(_pageSize);

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
        currentPage,
        pageSize,
        list: resp2,
        total: resp1[0][0].total,
      },
    });
  }
  // 获取好友动态
  async getFriendsMoments(ctx) {
    const userId = ctx.user.userId;
    // 分页参数处理
    const { currentPage: _currentPage = 1, pageSize: _pageSize = 10 } = ctx.request.query;
    const currentPage = Number(_currentPage);
    const pageSize = Number(_pageSize);

    const friendIdList = await ctx.service.contactService.getContactIdList(userId);

    // 获取动态的用户ID区间
    const idRange = [...friendIdList, userId].join(', ');

    // 动态列表中选择的列
    const momentTableSelectColumns = getTableSelectColumns(Object.values(MOMENTS_TABLE), TABLE_NAMES.MOMENTS);

    // 根据ID批量查询用户的动态
    const SQL = `SELECT ${momentTableSelectColumns}, JSON_OBJECT(${getJSONOBJECTColumns(
      userTableCommonColumns
    )}) user_info FROM ${TABLE_NAMES.MOMENTS} JOIN ${TABLE_NAMES.USERS} ON ${TABLE_NAMES.MOMENTS}.user_id = ${
      TABLE_NAMES.USERS
    }.id WHERE ${TABLE_NAMES.MOMENTS}.user_id IN (${idRange}) ORDER BY ${
      TABLE_NAMES.MOMENTS
    }.create_time ${SORT_TYPE.DESC} LIMIT ${(currentPage - 1) * pageSize}, ${pageSize}`;

    // 查询总共有多少条动态
    const totalSQL = `SELECT COUNT(*) as total FROM ${TABLE_NAMES.MOMENTS} WHERE user_id IN (${idRange})`;

    const [resp1, resp2] = await Promise.all([connections.execute(totalSQL), connections.execute(SQL)]);

    return ctx.makeResp({
      code: STATUS_CODE.SUCCESS,
      data: {
        currentPage,
        pageSize,
        list: resp2[0],
        total: resp1[0][0].total,
      },
    });
  }
}

module.exports = new MomentController();
