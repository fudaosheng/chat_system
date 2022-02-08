import request, { BaseResponse } from ".";

// 修改群备注
export const modifyChatGroupNote = (id: number, note: string) => request({
    url: '/chat_group_contact/modify_chat_group_note',
    method: 'POST',
    data: { id, note }
});
export interface GetChatGroupMembersResp extends BaseResponse {
    data: Array<ChatGroupMember>;
}
// 获取群成员
export const getChatGroupMembers = (id: number): Promise<GetChatGroupMembersResp> => request({
    url: '/chat_group_contact/get_members',
    data: { id }
})