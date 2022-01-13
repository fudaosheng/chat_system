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
    url: '/apply_contact_ticket/get/ticket_list',
    data,
})

// 查询别人发给自己的申请工单的数量
export const getApplyTicketList = () => request({
    url: '/apply_contact_ticket/get/apply_ticket_list',
});
// 拒绝添加联系人
export const rejectAddContact = (id: number) => request({
    url: '/apply_contact_ticket/reject_add_contact',
    method: 'POST',
    data: { id }
})
export interface AgreeAddContactRequest {
    apply_contact_ticketId: number;
    note: string;
    group_id: number;
}
//同意添加联系人
export const agreeAddContact = (data: AgreeAddContactRequest) => request({
    url: '/apply_contact_ticket/agree_add_contact',
    method: 'POST',
    data
})