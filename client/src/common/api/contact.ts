import request from ".";

export interface AddContactRequest {
    userId: number; // 要添加的人的id
    group_id: number; //添加时选择的分组id
    message: string; // 申请信息
}
export const addContact = (data: AddContactRequest) => request({
    url: '/contact/add',
    method: 'POST',
    data
})