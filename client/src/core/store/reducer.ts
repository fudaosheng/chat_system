import { WebsocketState } from 'core/typings';
import produce from 'immer';
import { WebsocketActionResp, WebsocketActionType } from '.';

export const websocketReducer = (state: WebsocketState, action: WebsocketActionResp): WebsocketState => {
  const newState = produce(state, draft => {
    switch (action.type) {
      case WebsocketActionType.CREATE_CHAT: {
        // 在原来的会话列表中查找与receiver的会话
        const index = draft.chatList.findIndex(i => i?.receiver?.id === action.payload.id);
        // 新建会话
        if (index === -1) {
          draft.chatList.unshift({
            receiver: action.payload,
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
      default:
        throw new Error();
    }
  });
  return newState;
};
