import request, { BaseResponse } from '.';

interface CreateChatGroupResp extends BaseResponse {
  data: {
    id: number;
    name: string;
    avatar?: string;
  };
}
// 创建群聊会话
export const createChatGroup = (name: string, avatar = ''): Promise<CreateChatGroupResp> =>
  request({
    url: '/chat_group/create',
    method: 'POST',
    data: { name, avatar },
  });
