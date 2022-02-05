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

export interface GetChatGroupByIdResp extends BaseResponse {
  data: Array<ChatGroup>;
}

// 根据id搜索群
export const getChatGroupById = (id: number): Promise<GetChatGroupByIdResp> =>
  request({
    url: '/chat_group/get_chat_group_by_id',
    data: { id },
  });
export interface GetChatGroupListByName extends BaseResponse {
  data: Array<ChatGroup>;
}
export const getChatGroupListByName = (name: string): Promise<GetChatGroupListByName> =>
  request({
    url: '/chat_group/get_chat_group_list_by_name',
    data: { name },
  });

export interface GetChatGroupListResp extends BaseResponse {
  data: Array<ChatGroup>;
}
//获取用户群聊列表
export const getChatGroupList = () =>
  request({
    url: '/chat_group/get_chat_group_list',
  });
