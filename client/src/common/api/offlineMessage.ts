import { MessageStruct } from 'core/typings';
import { BaseResponse, request } from '.';

interface GetOfflineMessageListResp extends BaseResponse {
  data: Array<{
    fromId: number;
    messageList: Array<MessageStruct>;
  }>;
}

// 获取用户的离线消息，同时以fromId分组
export const getOfflineMessageList = (): Promise<GetOfflineMessageListResp> =>
  request({
    url: '/offline_message/list',
  });

// 删除用户的所有离线消息
export const deleteAllOfflineMessage = () =>
  request({
    url: '/offline_message/delete/delete_all_offline_message',
    method: 'POST',
  });
