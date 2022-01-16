import request, { BaseResponse } from '.';

export interface DetailContactGroupInfo extends ContactGroup {
  contactList: Array<UserInfo>;
}
interface GetContactListResp extends BaseResponse {
  data: Array<DetailContactGroupInfo>;
}
export const getContactList = (): Promise<GetContactListResp> =>
  request({
    url: '/contacts/get/contact_list',
  });
interface GetContactListByGroupIdsResp extends BaseResponse {
  data: Array<{ groupId: number; contactList: Array<UserInfo> }>;
}
export const getContactListByGroupIds = (group_id_list: Array<Number>): Promise<GetContactListByGroupIdsResp> =>
  request({
    url: '/contacts/get/contact_list_by_group_ids',
    data: { group_id_list },
  });
