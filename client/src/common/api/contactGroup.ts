import request from ".";

export const createContactGroup = (name: string) => request({
    url: '/contact_group/create',
    method: 'POST',
    data: { name }
})