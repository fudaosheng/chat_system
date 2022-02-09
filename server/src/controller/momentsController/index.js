const { STATUS_CODE } = require("../../constance");
const { TABLE_NAMES, MOMENTS_TABLE } = require("../../constance/tables");

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
        if(Array.isArray(imgs_list) && imgs_list.length) {
            moment[MOMENTS_TABLE.IMGS_LIST] = JSON.stringify(imgs_list);
        }

        await ctx.service.dbService.insert(moment, TABLE_NAMES.MOMENTS);

        return ctx.makeResp({ code: STATUS_CODE });
    }
} 

module.exports = new MomentController();