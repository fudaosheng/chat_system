import request, { BaseResponse } from ".";

export interface AddContactRequest {
    userId: number; // 要添加的人的id
    group_id: number; //添加时选择的分组id
    message: string; // 申请信息
}
export const addContact = (data: AddContactRequest) => request({
    url: '/apply_contact_ticket/add',
    method: 'POST',
    data
});

export interface GetApplyContactTicketListRequest {
    currentPage: number;
    pageSize: number;
}
export interface GetApplyContactTicketListResponse extends BaseResponse {
    data: {
        applyTicketList: Array<ApplyContactTicket>; //申请列表
        total: number; //数据总数
    };
}
export const getApplyContactTicketList = (data: GetApplyContactTicketListRequest): Promise<GetApplyContactTicketListResponse> => request({
    url: '/apply_contact_ticket/get/apply_contact_ticket_list',
    data,
})