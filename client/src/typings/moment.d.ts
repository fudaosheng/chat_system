interface Moment {
  id: number;
  user_id: number;
  content: string;
  imgs_list?: Array<string>;
  create_time: string;
  update_time: string;
}
interface MomentExtra extends Moment {
  user_info: UserInfo;
  like_user_ids: Array<{ id: number }>
}

interface MomentLikeRecord {
  id: number;
  user_id: number;
  moment_id: number;
  moment_type: number;
  create_time: string;
}
