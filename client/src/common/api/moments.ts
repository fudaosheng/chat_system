import request from ".";

export const createMoment = (content: string, imgs_list?: Array<string>) => request({
    url: '/moments/create',
    method: 'POST',
    data: { content, imgs_list }
})