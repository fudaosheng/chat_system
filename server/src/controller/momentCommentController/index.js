const { STATUS_CODE } = require('../../constance');
const { TABLE_NAMES, MOMENT_COMMENTS_TABLE } = require('../../constance/tables');

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
}

module.exports = new MomentCommentController();
