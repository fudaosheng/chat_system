import { LOCAL_STORAGE_USER_INFO, LOCAL_STORAGE_USER_TOKEN } from 'common/constance/localStorage';
import { defaultUserInfo } from '.';
export enum GLOBAL_OPERATION_TYPE {
  SET_USER_INFO, //设置用户信息
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
    localStorage.removeItem(LOCAL_STORAGE_USER_INFO);
    localStorage.removeItem(LOCAL_STORAGE_USER_TOKEN);
    return {
      type: GLOBAL_OPERATION_TYPE.SET_USER_INFO,
      payload: defaultUserInfo,
    };
  }
};
