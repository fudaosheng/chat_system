import { WebsocketActionResp, WebsocketActionType } from '.';

export const WebsocketAction = {
  // 创建会话
  createChat(recevicer: UserInfo): WebsocketActionResp {
    return {
      type: WebsocketActionType.CREATE_CHAT,
      payload: recevicer,
    };
  },
};
