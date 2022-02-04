// 群聊相关的类型定义

// 群聊
interface ChatGroup {
  announcement?: string;
  avatar: string;
  create_time: string;
  id: number;
  name: string;
  owner_id: number;
  update_time: string;
}
//群聊申请工单
interface ChatGroupApplyTicket {
  id: number;
  applicant_user_id: number;
  group_id: number;
  target_user_id: number;
  status: number;
  create_time: string;
  update_time: string;
}
// 详细的群聊申请工单信息
interface ChatGroupApplyTicketExtra extends ChatGroupApplyTicket {
  id: number;
  applicant_user_id: number;
  applicant_user: UserInfo;
  group_id: number;
  chat_group: ChatGroup;
  target_user_id: number;
  target_user: UserInfo;
  status: number;
  create_time: string;
  update_time: string;
}
