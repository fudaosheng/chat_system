import request, { BaseResponse } from "..";


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
});

// 获取评论列表
export interface GetCommentListResp extends BaseResponse {
    data: Array<CommentExtra>
}
export const getCommentList = (momentId: number) => request({
    url: '/moment_comment/get_comment_list',
    data: { momentId }
})