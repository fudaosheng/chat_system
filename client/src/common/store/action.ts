import { LOCAL_STORAGE_USER_INFO, LOCAL_STORAGE_USER_TOKEN } from 'common/constance/localStorage';
import { defaultUserInfo, initGlobalState } from '.';
export enum GLOBAL_OPERATION_TYPE {
  SET_USER_INFO, //设置用户信息
  CLEAR_USER_INFO, // 清除用户信息
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
  }
};
