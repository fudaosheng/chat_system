const { STATUS_CODE } = require('../../constance');
const { TABLE_NAMES, MOMENT_COMMENTS_TABLE } = require('../../constance/tables');
const connections = require('../../app/database');

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

    const contactIdList = await ctx.service.contactService.getContactIdList(userId);
    const idRange = [userId, ...contactIdList].join(',');

    // 查询好友和自己对该动态的评论
    const SQL = `SELECT * FROM moment_comments WHERE moment_comments.moment_id = ${momentId} AND moment_comments.user_id in (${idRange})`;

    // resp1是评论信息，resp2是联系人信息
    const [resp1, resp2] = await Promise.all([
      connections.execute(SQL),
      Promise.all(contactIdList.map(id => ctx.service.contactService.getContactInfo(userId, id)))
    ]);

    const commentList = resp1[0].map(comment => ({ ...comment, user_info: resp2.find(user => user.id === comment.user_id)  }));

    return ctx.makeResp({ code: STATUS_CODE.SUCCESS, data: commentList });
  }
}

module.exports = new MomentCommentController();
