import React, { useContext, useEffect, useRef } from 'react';
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
import { getOfflineMessageList } from 'common/api/offlineMessage';

const App: React.FC = () => {
  const {
    state: { userInfo },
    dispatch,
  } = useContext(GlobalContext);
  const {
    state: { ws, chatList },
    dispatch: websocketDispatch,
  } = useContext(WebsocketContext);
  const audioRef = useRef<HTMLAudioElement>({} as HTMLAudioElement);

  // 将消息放入消息栈
  const appendMessage = (chatId: number, fromId: number, ...messageList: Array<MessageStruct>) => {
    const index = findIndex(chatId, chatList);
    if (index !== -1) {
      websocketDispatch(WebsocketAction.append(chatId, ...messageList));
      // 触发消息提示音
      audioRef.current?.play();
    } else {
      // 接收到消息，但是此时消息列表中不存在该会话，需要先创建
      fromId &&
        getContactInfo(fromId)
          .then(res => {
            const { data: receiver } = res;
            websocketDispatch(WebsocketAction.createChat(chatId, receiver));
            websocketDispatch(WebsocketAction.append(chatId, ...messageList));
            // 触发消息提示音
          })
          .catch(err => console.error(err));
    }
  };

  const getOfflineMessageListReq = async () => {
    // 离线消息列表
    const { data = [] } = await getOfflineMessageList()
    data?.forEach(offlineMessage => {
      const { fromId, messageList } = offlineMessage;
      appendMessage(fromId, fromId, ...messageList);
    })
  };

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

  // 获取离线消息
  useEffect(() => {
    if (!userInfo.id) {
      return;
    }
    getOfflineMessageListReq();
  }, [userInfo.id]);

  // 接收消息
  useEffect(() => {
    if (!(userInfo.id && ws)) {
      return;
    }
    let timer: NodeJS.Timeout;
    ping(ws, String(userInfo.id), _timer => (timer = _timer));

    const handleReceiveMessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data) as MessageStruct;
      // 修改chatId
      if (data?.chatId && data?.fromId) {
        data.chatId = data.fromId;
      }
      // 将消息放入消息栈
      appendMessage(data.chatId, data.fromId, data);
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
      <audio src={require('common/resource/tip.wav').default} ref={audioRef} />
    </div>
  );
};

export default App;
