import { LOCAL_STORAGE_CHAT_LIST } from 'common/constance/localStorage';
import { WebsocketState } from 'core/typings';
import produce from 'immer';
import { findIndex } from './util';
import { WebsocketActionResp, WebsocketActionType } from '.';

export const websocketReducer = (state: WebsocketState, action: WebsocketActionResp): WebsocketState => {
  const nextState = produce(state, draft => {
    switch (action.type) {
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
      // 忘消息栈中新增一条消息
      case WebsocketActionType.APPEND_MESSAGE: {
        const { chatId, message } = action.payload
        const index = findIndex(chatId, draft.chatList);
        if(index !== -1) {
          draft.chatList[index].conversations.push(message);
        } else {
          console.log('需要新建会话');
          
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
