import React, { useContext, useEffect } from 'react';
import './App.css';
import { AppRouter } from './router';
import { Login } from 'components/login';
import { LOCAL_STORAGE_USER_INFO } from 'common/constance/localStorage';
import { GlobalContext } from 'common/store';
import { GlobalAction } from 'common/store/action';
import { destoryWebsocket, ping, registryWebSocket } from 'core';
import { MessageStruct } from 'core/typings';
import { WebsocketAction } from 'core/store/action';
import { WebsocketContext } from 'core/store';
import { findIndex } from 'core/store/util';
import { getContactInfo } from 'common/api/contacts';

const App: React.FC = () => {
  const {
    state: { userInfo },
    dispatch,
  } = useContext(GlobalContext);
  const { state: { ws, chatList }, dispatch: websocketDispatch } = useContext(WebsocketContext);
  useEffect(() => {
    // 从缓存中读取用户信息
    const userInfoJSON = localStorage.getItem(LOCAL_STORAGE_USER_INFO);
    const userInfo = userInfoJSON ? JSON.parse(userInfoJSON) : undefined;
    if (userInfo) {
      dispatch(GlobalAction.setUserInfo(userInfo));
    }
  }, []);

  // 注册websocket
  useEffect(() => {
    const ws = registryWebSocket();
    websocketDispatch(WebsocketAction.registryWebsocket(ws));
  }, []);

  useEffect(() => {
    if (!(userInfo.id && ws)) {
      return;
    }
    let timer: NodeJS.Timeout;
    ping(ws, String(userInfo.id), _timer => timer = _timer);

    const handleReceiveMessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data) as MessageStruct;
      console.log('receiveMessage:', data);

      // 修改chatId
      if (data?.chatId && data?.fromId) {
        data.chatId = data.fromId;
      }
      // 将接收到的消息放入消息栈
      const index = findIndex(data.chatId, chatList);
      if(index !== -1) {
        websocketDispatch(WebsocketAction.append(data.chatId, data));
      } else {
        // 接收到消息，但是此时消息列表中不存在该会话，需要先创建
        getContactInfo(data.fromId).then(res => {
          const { data: receiver } = res;
          websocketDispatch(WebsocketAction.createChat(data.chatId, receiver));
          websocketDispatch(WebsocketAction.append(data.chatId, data));
        }).catch(err => console.error(err));
      }
    };
    ws.addEventListener('message', handleReceiveMessage);
    return () => {
      timer && clearInterval(timer);
      destoryWebsocket(ws);
      ws.removeEventListener('message', handleReceiveMessage);
    };
  }, [userInfo.id, ws]);

  return (
    <div className="App">
      <AppRouter />
      <Login />
    </div>
  );
};

export default App;
