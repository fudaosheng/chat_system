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
}