import { Message } from 'core/Message';
import { CHAT_TYPE } from 'core/typings';
import { WebsocketActionResp, WebsocketActionType } from '.';

export const WebsocketAction = {
  // 注册websocket
  registryWebsocket(ws: WebSocket): WebsocketActionResp {
    return {
      type: WebsocketActionType.REGISTRY_WEBSOCKET,
      payload: ws,
    }
  },
  reset(): WebsocketActionResp {
    return {
      type: WebsocketActionType.RESET,
      payload: {},
    }
  },
  // 创建会话
  createChat(chatId: number, type: CHAT_TYPE, members: Array<UserInfo>, chatGroupInfo?: ChatGroup): WebsocketActionResp {
    return {
      type: WebsocketActionType.CREATE_CHAT,
      payload: { chatId, type, members, chatGroupInfo },
    };
  },
  // 将消息添加到会话列表
  append(chatId: number, ...message: Array<Message>): WebsocketActionResp {
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
