import { MessageStruct } from 'core/typings';
import { BaseResponse, request } from '.';

interface GetOfflineMessageListResp extends BaseResponse {
  data: Array<{
    chatId: number;
    messageList: Array<MessageStruct>;
  }>;
}

// 获取用户的离线消息，同时以fromId分组
export const getOfflineMessageList = (): Promise<GetOfflineMessageListResp> =>
  request({
    url: '/offline_message/list',
  });

// 获取用户所有群聊的离线消息，以chatId分组
export const getChatGroupOfflineMessageList = (): Promise<GetOfflineMessageListResp> =>
  request({
    url: '/offline_message/chat_group_message_list',
  });

// 删除用户的所有离线消息
export const deleteAllOfflineMessage = () =>
  request({
    url: '/offline_message/delete/delete_all_offline_message',
    method: 'POST',
  });
