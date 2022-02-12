import request from "..";


export interface SubmitCommentData {
    momentId: number;
    content: string;
    imgs_list?: Array<string>;
    parent_id?: number
}
export const submitComment = (data: SubmitCommentData) => request({
    url: '/moment_comment/submit_comment',
    method: 'POST',
    data
})