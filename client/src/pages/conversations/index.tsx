import { WebsocketContext } from 'core/store';
import React, { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextArea } from '@douyinfe/semi-ui';
import { IconEmoji } from '@douyinfe/semi-icons';
import styles from './index.module.scss';
import { Message } from 'core/Message';
import { sendMessage } from 'core';
import { MessageType } from 'core/typings';

export const Conversations: React.FC = () => {
  const { userId } = useParams<any>();
  const {
    state: { chatList },
  } = useContext(WebsocketContext);

  const [value, setValue] = useState('');

  // 会话
  const chat = useMemo(() => chatList.find(i => i?.receiver?.id === Number(userId)), [chatList, userId]);

  // 发送消息
  const handleSendMessage = () => {
    const { receiver } = chat || {};
    if (!receiver?.id) {
      return;
    }
    // 构造一个消息对象
    const message = new Message(receiver.id, value, MessageType.TEXT);
    console.log(message);
    const result = sendMessage(message);
    console.log(result);
    // 清空输入框内容
    setValue('');
  };

  return (
    <div className={styles.conversations}>
      <div className={styles.receiver}>
        <div>{chat?.receiver?.note || chat?.receiver?.name || ''}</div>
      </div>
      <div className={styles.conversationList}></div>
      <div className={styles.footer}>
        <div className={styles.funtionNav}>
          <IconEmoji size="large" />
        </div>
        <div className={styles.editor}>
          <TextArea
            autoFocus
            className={styles.textArea}
            value={value}
            onChange={v => setValue(v)}
            onEnterPress={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};
