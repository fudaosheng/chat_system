import { WebsocketContext } from 'core/store';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IconEmoji } from '@douyinfe/semi-icons';
import styles from './index.module.scss';
import { Message } from 'core/Message';
import { sendMessage } from 'core';
import { MessageStruct, MessageType } from 'core/typings';
import { WebsocketAction } from 'core/store/action';
import { ConversationList } from 'components/conversationList';
import { GlobalContext } from 'common/store';
import { TextArea } from 'components/textArea';

export const Conversations: React.FC = () => {
  const { userId } = useParams<any>();
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  const {
    state: { chatList },
    dispatch,
  } = useContext(WebsocketContext);

  // 接收消息
  useEffect(() => {
    const { ws } = window;
    if(!ws) {
      return;
    }
    const handleReceiveMessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data) as MessageStruct;
      // 修改chatId
      if(data?.chatId && data?.fromId) {
        data.chatId = data.fromId;
      }
      // 将接收到的消息放入消息栈
      dispatch(WebsocketAction.append(data.chatId, data));
    }
    ws.addEventListener('message', handleReceiveMessage);
    return () => ws.removeEventListener('message', handleReceiveMessage);
  }, [window.ws]);

  // 会话
  const chat = useMemo(() => chatList.find(i => i?.receiver?.id === Number(userId)), [chatList, userId]);

  // 消息接收人列表
  const receiverList = useMemo(() => {
    return chat?.receiver ? [chat.receiver] : [];
  }, [chat]);

  // 发送消息
  // todo：发送消息时用blob发送，阻止回车换行
  const handleSendMessage = (value: string) => {
    const { receiver } = chat || {};
    if (!receiver?.id) {
      return;
    }
    // 构造一个消息对象
    const message = new Message(receiver.id, receiver.id, value, MessageType.TEXT);
    sendMessage(message);
    dispatch(WebsocketAction.append(message.receiverId, message));
  };

  return (
    <div className={styles.conversations}>
      <div className={styles.receiver}>
        <div>{chat?.receiver?.note || chat?.receiver?.name || ''}</div>
      </div>
      <div className={styles.conversationList}>
        <ConversationList userInfo={userInfo} receiverList={receiverList} conversationList={chat?.conversations} />
      </div>
      <div className={styles.footer}>
        <div className={styles.funtionNav}>
          <IconEmoji size="large" />
        </div>
        <div className={styles.editor}>
          <TextArea className={styles.textArea} sendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};
