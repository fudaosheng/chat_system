interface UserInfo {
    id: number;
    token: string;
    name: string;
    avatar: string;
    bio: string;
    birthday?: string;
    sex?: number;
    phone_num?: string;
}

interface ContactGroup {
    id: number;
    name: string;
    user_id: number;
    contact_ids?: string;
    create_time: string;
    update_time: string;
}