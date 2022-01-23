import { Message } from 'core/Message';
import { WebsocketActionResp, WebsocketActionType } from '.';

export const WebsocketAction = {
  // 注册websocket
  registryWebsocket(ws: WebSocket): WebsocketActionResp {
    return {
      type: WebsocketActionType.REGISTRY_WEBSOCKET,
      payload: ws,
    }
  },
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
  },
  // 更新最后一个已读消息下标
  updateLastReadedMessageIndex(chatId: number): WebsocketActionResp {
    return {
      type: WebsocketActionType.UPDATE_LAST_READED_MESSAGE_INDEX,
      payload: { chatId },
    };
  }
};
