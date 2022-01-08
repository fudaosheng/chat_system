import request from ".";

export const addContact = (userId: number) => request({
    url: '/contact/add',
    method: 'POST',
    data: { userId }
})