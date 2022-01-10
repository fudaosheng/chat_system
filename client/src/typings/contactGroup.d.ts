interface ApplyContactTicket {
    applicant_user: UserInfo;
    target_user: UserInfo;
    create_time: string;
    update_time: string;
    group_id: number;
    id: number;
    message: string;
    status: number;
}