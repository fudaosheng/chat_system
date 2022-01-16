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
interface UserInfoExtra extends UserInfo {
  label: string;
  key: string;
  value: number;
}
// 分组信息，不包括用户信息
interface ContactGroup {
  id: number;
  name: string;
  user_id: number;
  create_time: string;
  update_time: string;
}
interface ContactGroupExtra extends ContactGroup {
  label: string;
  key: string;
  value: number;
}

interface DetailContactGroupInfoExtra extends ContactGroupExtra {
  children: Array<UserInfoExtra>
}
