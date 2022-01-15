interface UserInfo {
  id: number;
  token: string;
  name: string;
  note?: string; //好友备注
  avatar: string;
  bio: string;
  birthday?: string;
  sex?: number;
  phone_num?: string;
}
// 详细的分组信息
interface DetailContactGroupInfo {
  id: number; //分组id
  name: string; // 分组name
  create_time: string;
  update_time: string;
  contact_list: Array<UserInfo>; //联系人列表
}
interface ContactGroupExtra extends ContactGroup {
  label: string;
  key: string;
  value: number;
}

interface DetailContactGroupInfoExtra extends DetailContactGroupInfo {
  label: string;
  key: string;
  value: number;
}
