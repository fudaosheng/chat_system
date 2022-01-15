// 简单的分组信息，不包括用户信息
interface ContactGroup {
    id: number;
    name: string;
    user_id: number;
    contact_ids?: string;
    create_time: string;
    update_time: string;
}