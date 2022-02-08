import { LOCAL_STORAGE_CHAT_LIST } from 'common/constance/localStorage';
import { CHAT_TYPE, WebsocketState } from 'core/typings';
import produce from 'immer';
import { findIndex, toTopChat } from './util';
import { WebsocketActionResp, WebsocketActionType } from '.';
import { unionBy } from 'lodash';

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
      // 创建会话，添加消息时将当前会话置顶
      case WebsocketActionType.CREATE_CHAT: {
        const { chatId, type, members, chatGroupInfo } = action.payload;
        // 在原来的会话列表中查找与receiver的会话
        const index = findIndex(chatId, type, draft.chatList);
        // 新建会话
        if (index === -1) {
          draft.chatList.unshift({
            type,
            members,
            chatGroupInfo,
            id: chatId, //chatId
            lastReadedMessageIndex: -1,
            conversations: [],
          });
        } else {
          // 将原来会话置顶
          draft.chatList = toTopChat(index, draft.chatList);
        }
        break;
      }
      // 往消息栈中新增一条消息
      case WebsocketActionType.APPEND_MESSAGE: {
        const { chatId, type, message = [] } = action.payload;
        const index = findIndex(chatId, type, draft.chatList);

        if(index !== -1) {
          // 将原来会话置顶
          draft.chatList = toTopChat(index, draft.chatList);
          // 每个消息都是唯一的，需要去重
          draft.chatList[index].conversations = unionBy(draft.chatList[index].conversations, message, 'id');
        }
        break;
      }
      // 更新最后一个已读消息下标
      case WebsocketActionType.UPDATE_LAST_READED_MESSAGE_INDEX: {
        const { chatId, type } = action.payload;
        const index = findIndex(chatId, type, draft.chatList);
        if(index !== -1) {
          draft.chatList[index].lastReadedMessageIndex = draft.chatList[index].conversations.length - 1
        }
        break;
      }
      // 更新群公告
      case WebsocketActionType.UPDATE_CHAR_GROUP_ANNOUNCEMENT: {
        const { chatId, announcement } = action.payload;
        const index = findIndex(chatId, CHAT_TYPE.CHAT_GROUP, draft.chatList);
        if(index > -1 && draft.chatList[index]?.chatGroupInfo) {
          (draft.chatList[index].chatGroupInfo as ChatGroupExtra).announcement = announcement;
        }
        break;
      }
      // 更新群公告
      case WebsocketActionType.UPDATE_CHAT_GROUP_MEMBERS: {
        const { chatId, members } = action.payload;
        const index = findIndex(chatId, CHAT_TYPE.CHAT_GROUP, draft.chatList);
        if(index > -1) {
          draft.chatList[index].members = members;
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
