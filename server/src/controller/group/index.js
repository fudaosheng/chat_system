const { CONTACT_GROUP_TABLE, TABLE_NAMES } = require('../../constance/tables');
const { STATUS_CODE } = require('../../constance');
class GroupController {
    async createGroup(ctx) {
        const { name } = ctx.request.body;
        const userId = ctx.user.userId;
        // 想group表中插入数据
        const groupRecord = {
            [CONTACT_GROUP_TABLE.NAME]: name,
            [CONTACT_GROUP_TABLE.USER_ID]: userId
            // [CONTACT_GROUP_TABLE.CONTACT_IDS]: '',
        }
        console.log(`create group:`, groupRecord);
        
        // 查询该用户是否已有这个name的分组
        const groupList = await ctx.service.dbService.query(groupRecord, TABLE_NAMES.CONTACT_GROUP);
        if(groupList.length) {
            return ctx.makeResp({ code: STATUS_CODE.ERROR, message: '该分组已存在，不能重复创建' });
        }
        const result = await ctx.service.dbService.insert(groupRecord, TABLE_NAMES.CONTACT_GROUP);
        return ctx.makeResp({ code: result.insertId !== undefined ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR });
    }
}

module.exports = new GroupController();