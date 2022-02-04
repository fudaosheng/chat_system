import request, { BaseResponse } from '.';

// 批量创建好友申请工单
export const batchCreateChatGroupApplyTickets = (groupId: number, userIdList: Array<number>) =>
  request({
    url: '/chat_group_apply_ticket/batch_create_tickets',
    method: 'POST',
    data: { groupId, userIdList },
  });

export interface GetAllRelatedChatGroupApplyTicketsRequest {
  currentPage: number;
  pageSize: number;
}
export interface GetAllRelatedChatGroupApplyTicketsResponse extends BaseResponse {
  data: {
    applyTicketList: Array<ApplyContactTicket>; //申请列表
    total: number; //数据总数
  };
}

// 获取个人所有群聊工单
export const getAllRelatedChatGroupApplyTickets = (
  data: GetAllRelatedChatGroupApplyTicketsRequest
): Promise<GetAllRelatedChatGroupApplyTicketsResponse> =>
  request({
    url: '/chat_group_apply_ticket/get_all_related_tickets',
    data,
  });
export interface GetAllChatGroupApplyTicketsResp extends BaseResponse {
  data: Array<ChatGroupApplyTicket>;
}
// 查询待自己处理的工单
export const getAllChatGroupApplyTickets = (): Promise<GetAllChatGroupApplyTicketsResp> =>
  request({
    url: '/chat_group_apply_ticket/get/chat_group_apply_tickets',
  });
