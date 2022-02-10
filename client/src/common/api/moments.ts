import request, { BaseResponse } from '.';

export const createMoment = (content: string, imgs_list?: Array<string>) =>
  request({
    url: '/moments/create',
    method: 'POST',
    data: { content, imgs_list },
  });

// 获取用户动态列表
export interface GetUserMomentListResp extends BaseResponse {
  data: {
    currentPage: number;
    pageSize: number;
    total: number;
    list: Array<Moment>;
  };
}
// 获取个人动态
export const getUserMomentList = (currentPage: number, pageSize: number): Promise<GetUserMomentListResp> =>
  request({
    url: '/moments/get_user_moments',
    data: { currentPage, pageSize },
  });

export interface GetFriendsMomentListResp extends BaseResponse {
  data: {
    currentPage: number;
    pageSize: number;
    total: number;
    list: Array<MomentExtra>;
  };
}

// 获取好友包括自己的动态列表
export const getFriendsMomentList = (currentPage: number, pageSize: number): Promise<GetFriendsMomentListResp> =>
  request({
    url: '/moments/get_friends_moments',
    data: { currentPage, pageSize },
  });
