import { LOCAL_STORAGE_USER_INFO, LOCAL_STORAGE_USER_TOKEN } from 'common/constance/localStorage';
import { defaultUserInfo, initGlobalState } from '.';
export enum GLOBAL_OPERATION_TYPE {
  SET_USER_INFO, //设置用户信息
  CLEAR_USER_INFO, // 清除用户信息
  SET_CONTACT_GROUP_LIST, //更新联系人分组列表
  SET_CHAT_GROUP_LIST, //更新群聊列表
}

export interface GlobalActionType {
  type: GLOBAL_OPERATION_TYPE;
  payload: any;
}

export const GlobalAction = {
  setUserInfo(userInfo: UserInfo): GlobalActionType {
    // 设置缓存
    localStorage.setItem(LOCAL_STORAGE_USER_INFO, JSON.stringify(userInfo));
    localStorage.setItem(LOCAL_STORAGE_USER_TOKEN, userInfo?.token || '');
    
    return {
      type: GLOBAL_OPERATION_TYPE.SET_USER_INFO,
      payload: userInfo,
    };
  },
  clearUserInfo(): GlobalActionType {
    // 清楚所有缓存
    localStorage.clear();
    return {
      type: GLOBAL_OPERATION_TYPE.CLEAR_USER_INFO,
      payload: defaultUserInfo,
    };
  },
  setContactGroupList(newContactGroupList: Array<DetailContactGroupInfoExtra>):GlobalActionType {
    return {
      type: GLOBAL_OPERATION_TYPE.SET_CONTACT_GROUP_LIST,
      payload: newContactGroupList,
    };
  },
  // 更新群聊列表
  setChatGroupList(newChatGroupList: Array<ChatGroup>): GlobalActionType {
    return {
      type: GLOBAL_OPERATION_TYPE.SET_CHAT_GROUP_LIST,
      payload: newChatGroupList,
    };
  }
};
