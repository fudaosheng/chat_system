import { MessageStruct } from 'core/typings';
import { BaseResponse, request } from '.';

interface GetOfflineMessageListResp extends BaseResponse {
  data: Array<{
    fromId: number;
    messageList: Array<MessageStruct>;
  }>;
}
export const getOfflineMessageList = (): Promise<GetOfflineMessageListResp> =>
  request({
    url: '/offline_message/list',
  });
