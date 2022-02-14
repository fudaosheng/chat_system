import { produce } from 'immer';
import { GlobalState } from '.';
import { GlobalActionType, GLOBAL_OPERATION_TYPE } from './action';

export const reducer = (state: GlobalState, action: GlobalActionType): GlobalState => {
  return produce(state, draft => {
    switch (action.type) {
      case GLOBAL_OPERATION_TYPE.SET_USER_INFO: {
        draft.userInfo = action.payload;
        break;
      }
      case GLOBAL_OPERATION_TYPE.CLEAR_USER_INFO: {
        draft.userInfo = action.payload;
        break;
      }
      case GLOBAL_OPERATION_TYPE.SET_CONTACT_GROUP_LIST: {
        draft.contactGroupList = action.payload;
        break;
      }
      case GLOBAL_OPERATION_TYPE.SET_CHAT_GROUP_LIST: {
        draft.chatGroupList = action.payload;
        return;
      }
      default:
        throw new Error();
    }
  });
};
