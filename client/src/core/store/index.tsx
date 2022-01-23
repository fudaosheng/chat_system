import { WebsocketState } from 'core/typings';
import { getChatListWithStorage } from 'core/store/util';
import React, { createContext, Dispatch, memo, useReducer } from 'react';
import { websocketReducer } from './reducer';

export enum WebsocketActionType {
  REGISTRY_WEBSOCKET,
  CREATE_CHAT, //创建会话
  APPEND_MESSAGE, //将消息添加到会话列表
}
export interface WebsocketActionResp {
  type: WebsocketActionType;
  payload: any;
}
interface ContextType {
  state: WebsocketState;
  dispatch: Dispatch<WebsocketActionResp>;
}

const initState: WebsocketState = {
  ws: undefined,
  chatList: getChatListWithStorage() || [],
};

export const WebsocketContext = createContext<ContextType>({ state: initState, dispatch: () => {} });
WebsocketContext.displayName = 'websocketContext';

export const WebsocketProvider: React.FC = memo(({ children }) => {
  const [state, dispatch] = useReducer(websocketReducer, initState);
  
  return <WebsocketContext.Provider value={{ state, dispatch }}>{children}</WebsocketContext.Provider>;
});
