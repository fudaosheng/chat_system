import request from ".";

// 批量创建好友申请工单
export const batchCreateChatGroupApplyTickets = (groupId: number, userIdList: Array<number>) => request({
    url: '/chat_group_apply_ticket/batch_create_tickets',
    method: 'POST',
    data: { groupId, userIdList }
});