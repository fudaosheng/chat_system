import request, { BaseResponse } from '.';

export const createContactGroup = (name: string) =>
  request({
    url: '/contact_group/create',
    method: 'POST',
    data: { name },
  });

export interface GetContactListResp extends BaseResponse {
  data: Array<ContactGroup>;
}
// 查询联系人分组列表
export const getContactList = (): Promise<GetContactListResp> =>
  request({
    url: '/contact_group/get',
    method: 'GET',
  });
