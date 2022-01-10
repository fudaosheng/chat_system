interface BaseApplyContactTicket {
  create_time: string;
  update_time: string;
  group_id: number;
  id: number;
  message: string;
  status: number;
}

// 包含详细的用户信息
interface ApplyContactTicket extends BaseApplyContactTicket {
  applicant_user: UserInfo;
  target_user: UserInfo;
}
// 不包含用户信息
interface ApplyTicket extends BaseApplyContactTicket {
  applicant_user_id: number;
  target_user_id: number;
}
