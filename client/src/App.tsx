import React, { useContext, useEffect, useRef } from 'react';
import './App.css';
import { AppRouter } from './router';
import { Login } from 'components/login';
import { LOCAL_STORAGE_USER_INFO } from 'common/constance/localStorage';
import { GlobalContext } from 'common/store';
import { GlobalAction } from 'common/store/action';
import { destoryWebsocket, ping, registryWebSocket } from 'core';
import { CHAT_TYPE, MessageStruct } from 'core/typings';
import { WebsocketAction } from 'core/store/action';
import { WebsocketContext } from 'core/store';
import { findIndex } from 'core/store/util';
import { getContactInfo } from 'common/api/contacts';
import {
  deleteAllOfflineMessage,
  getChatGroupOfflineMessageList,
  getOfflineMessageList,
} from 'common/api/offlineMessage';
import { Toast } from '@douyinfe/semi-ui';
import { getChatGroupDetailInfo } from 'common/api/chatGroup';
import { getChatGroupMembers } from 'common/api/chatGroupContact';
const AUDIO_ID = 'chat_system_audio';

const App: React.FC = () => {
  const {
    state: { userInfo },
    dispatch,
  } = useContext(GlobalContext);
  const {
    state: { ws, chatList },
    dispatch: websocketDispatch,
  } = useContext(WebsocketContext);
  const audioRef = useRef<HTMLAudioElement>();

  // 将消息放入消息栈
  const appendMessage = (chatId: number, type: CHAT_TYPE, ...messageList: Array<MessageStruct>) => {
    const index = findIndex(chatId, type, chatList);
    if (index !== -1) {
      websocketDispatch(WebsocketAction.append(chatId, type, ...messageList));
      // 触发消息提示音
      audioRef?.current?.play()?.catch(e => console.log(e));
    } else {
      // 接收到消息，但是此时消息列表中不存在该会话，需要先创建
      if (type === CHAT_TYPE.CHAT) {
        chatId &&
          getContactInfo(chatId)
            .then(res => {
              const { data: receiver } = res;
              websocketDispatch(WebsocketAction.createChat(chatId, CHAT_TYPE.CHAT, [receiver]));
              websocketDispatch(WebsocketAction.append(chatId, CHAT_TYPE.CHAT, ...messageList));
              // 触发消息提示音
              audioRef?.current?.play()?.catch(e => console.log(e));
            })
            .catch(err => console.error(err));
      }
      if (type === CHAT_TYPE.CHAT_GROUP) {
        Promise.all([getChatGroupDetailInfo(chatId), getChatGroupMembers(chatId)]).then(res => {
          websocketDispatch(
            WebsocketAction.createChat(chatId, CHAT_TYPE.CHAT_GROUP, res?.[1]?.data || [], res?.[0]?.data)
          );
          websocketDispatch(WebsocketAction.append(chatId, CHAT_TYPE.CHAT_GROUP, ...messageList));
          audioRef?.current?.play()?.catch(e => console.log(e));
        });
      }
    }
  };

  // 离线消息
  const getOfflineMessageListReq = async () => {
    // 获取离线消息列表
    const [resp1, resp2] = await Promise.all([getOfflineMessageList(), getChatGroupOfflineMessageList()]);
    // 单聊消息列表
    const { data = [] } = resp1;
    // 群聊消息列表
    const { data: chatGroupData = [] } = resp2;
    const offlineMessageList = data
      ?.map(i => ({ ...i, chatType: CHAT_TYPE.CHAT }))
      .concat(chatGroupData?.map(i => ({ ...i, chatType: CHAT_TYPE.CHAT_GROUP })));
    // 将离线消息放入消息队列
    offlineMessageList?.forEach(offlineMessage => {
      const { chatId, messageList = [], chatType } = offlineMessage;
      appendMessage(chatId, chatType, ...messageList);
    });
    // 删除该用户所有离线消息
    deleteAllOfflineMessage();
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
    if(!userInfo.id) {
      return;
    }
    const ws = registryWebSocket();
    websocketDispatch(WebsocketAction.registryWebsocket(ws));
  }, [userInfo.id]);

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
      if (data?.chatType === CHAT_TYPE.CHAT && data?.chatId && data?.fromId) {
        data.chatId = data.fromId;
      }
      // 将消息放入消息栈
      appendMessage(data.chatId, data.chatType, data);
    };
    const handleWebsocketClosed = () => {
      Toast.error('websocket关闭');
      window.location.reload();
    };
    ws.addEventListener('message', handleReceiveMessage);
    ws.addEventListener('close', handleWebsocketClosed);
    return () => {
      timer && clearInterval(timer);
      destoryWebsocket(ws);
      ws.removeEventListener('message', handleReceiveMessage);
      ws.removeEventListener('close', handleWebsocketClosed);
    };
  }, [userInfo.id, ws]);

  useEffect(() => {
    const audio = document.getElementById(AUDIO_ID);
    const handleCanplaythrough = () => {
      audioRef.current = audio as HTMLAudioElement;
    };
    audio?.addEventListener('canplaythrough', handleCanplaythrough);
    return () => audio?.removeEventListener('canplaythrough', handleCanplaythrough);
  }, []);

  return (
    <div className="App">
      <AppRouter />
      <Login />
      <audio src={require('common/resource/tip.wav').default} id={AUDIO_ID} />
    </div>
  );
};

export default App;
