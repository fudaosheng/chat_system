import { WebsocketState } from 'core/typings';
import React, { createContext, Dispatch, memo, useReducer } from 'react';
import { websocketReducer } from './reducer';

export enum WebsocketActionType {
  CREATE_CHAT, //创建会话
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
  key: '',
  chatList: [],
};

export const WebsocketContext = createContext<ContextType>({ state: initState, dispatch: () => {} });
WebsocketContext.displayName = 'websocketContext';

export const WebsocketProvider: React.FC = memo(({ children }) => {
  const [state, dispatch] = useReducer(websocketReducer, initState);
  
  return <WebsocketContext.Provider value={{ state, dispatch }}>{children}</WebsocketContext.Provider>;
});
