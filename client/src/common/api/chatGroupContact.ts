import request from ".";

// 修改群备注
export const modifyChatGroupNote = (id: number, note: string) => request({
    url: '/chat_group_contact/modify_chat_group_note',
    method: 'POST',
    data: { id, note }
})