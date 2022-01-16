import request, { BaseResponse } from '.';

export interface DetailContactGroupInfo extends ContactGroup {
  contactList: Array<UserInfo>;
}
interface GetContactListResp extends BaseResponse {
  data: Array<DetailContactGroupInfo>;
}
// 获取用户的联系人列表
export const getContactList = (): Promise<GetContactListResp> =>
  request({
    url: '/contacts/get/contact_list',
  });
interface GetContactListByGroupIdsResp extends BaseResponse {
  data: Array<{ groupId: number; contactList: Array<UserInfo> }>;
}
// 根据分组id列表批量查询用户的联系人信息
export const getContactListByGroupIds = (group_id_list: Array<Number>): Promise<GetContactListByGroupIdsResp> =>
  request({
    url: '/contacts/get/contact_list_by_group_ids',
    data: { group_id_list },
  });
// 查询联系人详细信息
export const getContactInfo = (userId: number): Promise<BaseResponse & { data: UserInfo }> => request({
  url: '/contacts/get/contact_info',
  data: { userId }
})

// 编辑好友备注
export const editContactNote = (userId: number, note: string) => request({
  url: '/contacts/edit/contact_note',
  method: 'POST',
  data: { userId, note }
})
