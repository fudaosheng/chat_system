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

    // 查询用户的动态量
    const totalSQL = `SELECT COUNT(*) as total FROM ${TABLE_NAMES.MOMENTS} WHERE user_id = ${userId}`;

    // LEFT JOIN 查询动态
    const SQL = `SELECT ${getTableSelectColumns(
      Object.values(MOMENTS_TABLE),
      TABLE_NAMES.MOMENTS
    )}, JSON_ARRAYAGG(JSON_OBJECT('id', moment_like.user_id)) like_user_ids 
      FROM moments LEFT JOIN moment_like ON moments.id = moment_like.moment_id 
      WHERE moments.user_id = ${userId} 
      GROUP BY moments.id
      ORDER BY ${TABLE_NAMES.MOMENTS}.create_time ${SORT_TYPE.DESC} 
      LIMIT ${(currentPage - 1) * pageSize}, ${pageSize}`;

    // 一次查询总数和用户动态
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

    // 根据ID批量查询用户的动态以及动态的点赞信息
    const SQL = `SELECT ${momentTableSelectColumns}, 
                  JSON_OBJECT(${getJSONOBJECTColumns(userTableCommonColumns)}) user_info,
                  JSON_ARRAYAGG(JSON_OBJECT('id', moment_like.user_id)) like_user_ids 
                  FROM moments LEFT JOIN users ON moments.user_id = users.id 
                  LEFT JOIN moment_like ON moments.id = moment_like.moment_id
                  WHERE moments.user_id IN (${idRange})
                  GROUP BY moments.id
                  ORDER BY moments.create_time ${SORT_TYPE.DESC} 
                  LIMIT ${(currentPage - 1) * pageSize}, ${pageSize}`;
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
