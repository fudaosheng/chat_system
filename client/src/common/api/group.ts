import request from ".";

export const createGroup = (name: string) => request({
    url: '/group/create',
    method: 'POST',
    data: { name }
})