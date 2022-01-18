import { Message } from 'core/Message';
import { WebsocketActionResp, WebsocketActionType } from '.';

export const WebsocketAction = {
  // 创建会话
  createChat(chatId: number, receiver: UserInfo): WebsocketActionResp {
    return {
      type: WebsocketActionType.CREATE_CHAT,
      payload: { chatId, receiver },
    };
  },
  // 将消息添加到会话列表
  append(chatId: number, message: Message): WebsocketActionResp {
    return {
      type: WebsocketActionType.APPEND_MESSAGE,
      payload: { chatId, message },
    };
  }
};
