import request, { BaseResponse } from '..';
export enum MomentType {
  MOMENT = 1,
  COMMENT = 2,
}
export const likeMoment = (momentId: number, momentType: MomentType) =>
  request({
    url: '/moment_like/like',
    method: 'POST',
    data: { momentId, momentType },
  });

export const unlikeMoment = (momentId: number, momentType: MomentType) =>
  request({
    url: '/moment_like/unlike',
    method: 'POST',
    data: { momentId, momentType },
  });

interface GetMomomentLikeStatus extends BaseResponse {
  data: Array<MomentLikeRecord>
}

export const getMomomentLikeRecord = (momentId: number, momentType: MomentType): Promise<GetMomomentLikeStatus> =>
request({
  url: '/moment_like/get_like_moment_record',
  method: 'GET',
  data: { momentId, momentType },
});
