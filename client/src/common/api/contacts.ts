import request, { BaseResponse } from '.';
import { getContactGroupList } from './contactGroup';
import { nanoid } from 'nanoid';

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
export const getContactInfo = (userId: number): Promise<BaseResponse & { data: UserInfo }> =>
  request({
    url: '/contacts/get/contact_info',
    data: { userId },
  });
// 批量查询联系人详细信息
export const getBulkContactInfo = (ids: Array<number>): Promise<BaseResponse & { data: Array<UserInfo> }> =>
  request({
    url: '/contacts/get/bulk_contact_info',
    data: { ids },
  });

// 编辑好友备注
export const editContactNote = (userId: number, note: string) =>
  request({
    url: '/contacts/edit/contact_note',
    method: 'POST',
    data: { userId, note },
  });

// 查询用户分组+分组下联系人，然后转换成tree型数据
export const makeTreeWithContactList = async (): Promise<Array<DetailContactGroupInfoExtra>> => {
  let newContactGroupList = [];
  return new Promise(async (resolve, reject) => {
    try {
      // 查询用户分组列表
      const { data: groupList = [] } = await getContactGroupList();
      const groupIdList = groupList.map(i => i.id);
      // 根据分组列表批量查询分组列表
      const { data } = await getContactListByGroupIds(groupIdList);

      // 将分组和联系人信息进行处理
      newContactGroupList = groupList?.map(item => ({
        ...item,
        label: item.name,
        value: item.id,
        key: nanoid(),
        type: 'group',
        children: (data?.find(i => i.groupId === item.id)?.contactList || []).map(i => ({
          ...i,
          label: i.name,
          value: i.id,
          key: nanoid(),
          type: 'contact',
        })),
      }));
      resolve(newContactGroupList);
    } catch (err) {
      reject(err);
    }
  });
};
