import { WebsocketContext } from 'core/store';
import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';

export const Conversations: React.FC = () => {
    const { userId } = useParams<any>();
    const { state: { chatList } } = useContext(WebsocketContext);

    // 会话
    const chat = useMemo(() => chatList.find(i => i?.receiver?.id === Number(userId)), [chatList, userId]);

    return (
        <div className={styles.conversations}>
            <div className={styles.receiver}>
                <div>{chat?.receiver?.note || chat?.receiver?.name || ''}</div>
            </div>
            <div className={styles.conversationList}></div>
            <div className={styles.editor}></div>
        </div>
    )
}