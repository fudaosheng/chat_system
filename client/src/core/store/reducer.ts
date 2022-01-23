import { LOCAL_STORAGE_CHAT_LIST } from 'common/constance/localStorage';
import { WebsocketState } from 'core/typings';
import produce from 'immer';
import { findIndex } from './util';
import { WebsocketActionResp, WebsocketActionType } from '.';

export const websocketReducer = (state: WebsocketState, action: WebsocketActionResp): WebsocketState => {
  const nextState = produce(state, draft => {
    switch (action.type) {
      // 注册websocket
      case WebsocketActionType.REGISTRY_WEBSOCKET: {
        draft.ws = action.payload;
        break;
      }
      case WebsocketActionType.RESET: {
        draft.chatList = [];
        draft.ws = undefined;
        break;
      }
      // 创建会话
      case WebsocketActionType.CREATE_CHAT: {
        const { chatId, receiver } = action.payload;
        // 在原来的会话列表中查找与receiver的会话
        const index = findIndex(chatId, draft.chatList);
        // 新建会话
        if (index === -1) {
          draft.chatList.unshift({
            receiver,
            id: receiver.id, //chatId
            lastReadedMessageIndex: 0,
            conversations: [],
          });
        } else {
          // 将原来会话置顶
          const oldChat = draft.chatList[index];
          draft.chatList.splice(index, 1);
          draft.chatList.unshift(oldChat);
        }
        break;
      }
      // 往消息栈中新增一条消息
      case WebsocketActionType.APPEND_MESSAGE: {
        const { chatId, message = [] } = action.payload;
        const index = findIndex(chatId, draft.chatList);

        if(index !== -1) {
          draft.chatList[index].conversations.push(...message);
        }
        break;
      }
      // 更新最后一个已读消息下标
      case WebsocketActionType.UPDATE_LAST_READED_MESSAGE_INDEX: {
        const { chatId } = action.payload;
        const index = findIndex(chatId, draft.chatList);
        if(index !== -1) {
          draft.chatList[index].lastReadedMessageIndex = draft.chatList[index].conversations.length - 1
        }
        break;
      }
      default:
        throw new Error();
    }
  });
  if(nextState.chatList !== state.chatList) {
    try {
      localStorage.setItem(LOCAL_STORAGE_CHAT_LIST, JSON.stringify(nextState.chatList));
    } catch(err) {
      console.error(err);
    }
  }
  return nextState;
};
