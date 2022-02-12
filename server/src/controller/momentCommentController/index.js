const { STATUS_CODE, SORT_TYPE } = require('../../constance');
const { TABLE_NAMES, MOMENT_COMMENTS_TABLE } = require('../../constance/tables');
const connections = require('../../app/database');
const { getTableSelectColumns, userTableCommonColumns, getJSONOBJECTColumns } = require('../../utils');

class MomentCommentController {
  // 提交评论
  async submitComment(ctx) {
    const { momentId, content, imgs_list, parent_id } = ctx.request.body;
    const userId = ctx.user.userId;
    // 评论内容
    const comment = {
      [MOMENT_COMMENTS_TABLE.USER_ID]: userId,
      [MOMENT_COMMENTS_TABLE.MOMENT_ID]: momentId,
      [MOMENT_COMMENTS_TABLE.CONTENT]: content,
      [MOMENT_COMMENTS_TABLE.PARENT_ID]: parent_id,
    };
    // 图片处理
    if (imgs_list && Array.isArray(imgs_list)) {
      comment[MOMENT_COMMENTS_TABLE.IMGS_LIST] = JSON.stringify(imgs_list);
    }
    // 写入评论
    await ctx.service.dbService.insert(comment, TABLE_NAMES.MOMENT_COMMENTS);
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS });
  }
  // 查询好友对动态的评论
  async getCommentList(ctx) {
    const { momentId } = ctx.request.query;
    const userId = ctx.user.userId;

    // 查询好友和自己对该动态的评论
    // users.id = ${userId} AND contacts.user_id = NULL 查询自己的评论
    const SQL = `SELECT ${getTableSelectColumns(Object.values(MOMENT_COMMENTS_TABLE), TABLE_NAMES.MOMENT_COMMENTS)},
                  JSON_OBJECT(${getJSONOBJECTColumns(userTableCommonColumns)}, 'note', contacts.note) user_info
                  FROM moment_comments JOIN users ON moment_comments.user_id = users.id 
                  JOIN contacts ON users.id = contacts.contact_id
                  WHERE moment_comments.moment_id = ${momentId} AND (contacts.user_id = ${userId} OR (users.id = ${userId} AND contacts.user_id = NULL)) 
                  ORDER BY moment_comments.create_time ${SORT_TYPE.ASC}`;
                
    const result = await connections.execute(SQL);
    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: result[0] });
  }
}

module.exports = new MomentCommentController();
