import { WebsocketContext } from 'core/store';
import React, { createRef, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';
import { Message } from 'core/Message';
import { sendMessage } from 'core';
import { CHAT_TYPE, MessageType } from 'core/typings';
import { WebsocketAction } from 'core/store/action';
import { ConversationList } from 'components/conversationList';
import { GlobalContext } from 'common/store';
import { Editor } from 'components/editor';
import { debounce } from 'lodash';
const debounceGap = 1000;

export const Conversations: React.FC = () => {
  const { chatId, chatType } = useParams<any>();
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  const {
    state: { chatList, ws },
    dispatch,
  } = useContext(WebsocketContext);
  const conversationsRef = createRef<HTMLDivElement>();

  // 会话
  const chat = useMemo(
    () => chatList.find(i => i.id === Number(chatId) && i.type === chatType),
    [chatList, chatId, chatType]
  );

  const membersMap = useMemo(() => {
    return new Map(chat?.members?.map(i => ([i.id, i])));
  }, []);

  useEffect(() => {
    // 监听鼠标移动，处理消息是否已读
    if (!(conversationsRef?.current && chat?.id)) {
      return;
    }
    const updateLastReadedMessageIndex = debounce(() => {
      dispatch(WebsocketAction.updateLastReadedMessageIndex(chat?.id));
    }, debounceGap);
    conversationsRef.current.addEventListener('mousemove', updateLastReadedMessageIndex);
    return () => conversationsRef.current?.removeEventListener('mousemove', updateLastReadedMessageIndex);
  }, [conversationsRef]);

  // 发送消息
  // todo：发送消息时用blob发送，阻止回车换行
  const handleSendMessage = (value: string, messageType?: MessageType) => {
    const receiverId = chatType === CHAT_TYPE.CHAT ? membersMap.get(Number(chatId))?.id : chat?.chatGroupInfo?.id;
    if (!(receiverId && ws)) {
      return;
    }
    // 构造一个消息对象
    const message = new Message(receiverId, userInfo.id, receiverId, value, messageType || MessageType.TEXT, chatType);
    sendMessage(ws, message);
    dispatch(WebsocketAction.append(message.receiverId, message));
  };

  // 会话名称
  const chatName = useMemo(() => {
    if (chat?.type === CHAT_TYPE.CHAT) {
      const receiver = membersMap.get(Number(chatId));
      return receiver?.note || receiver?.name;
    }
    if (chat?.type === CHAT_TYPE.CHAT_GROUP) {
      return chat.chatGroupInfo?.name;
    }
  }, [chat, membersMap]);

  return (
    <div className={styles.conversations} ref={conversationsRef}>
      <div className={styles.chatName}>
        <div>{chatName}</div>
      </div>
      <div className={styles.conversationList}>
        <ConversationList userInfo={userInfo} membersMap={membersMap} conversationList={chat?.conversations} />
      </div>
      <div className={styles.footer}>
        {/* <div className={styles.funtionNav}>
          <IconEmoji size="large" />
        </div> */}
        <div className={styles.editor}>
          {/* <TextArea className={styles.textArea} sendMessage={handleSendMessage} /> */}
          <Editor
            className={styles.textArea}
            sendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};
