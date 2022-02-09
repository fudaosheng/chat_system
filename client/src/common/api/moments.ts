import request from '.';

export const createMoment = (content: string, imgs_list?: Array<string>) =>
  request({
    url: '/moments/create',
    method: 'POST',
    data: { content, imgs_list },
  });

// 获取用户动态列表
export interface GetUserMomentListReso {
  data: {
    total: number;
    list: Array<Moment>
  };
}
export const getUserMomentList = (currentPage: number, pageSize: number): Promise<GetUserMomentListReso> =>
  request({
    url: '/moments/get_user_moments',
    data: { currentPage, pageSize }
  });
