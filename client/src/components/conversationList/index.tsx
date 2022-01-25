import { MessageStruct, MessageType } from 'core/typings';
import React, { createRef, useEffect, useMemo } from 'react';
import { Avatar } from '@douyinfe/semi-ui';
import { IconCommentStroked } from '@douyinfe/semi-icons';
import styles from './index.module.scss';
import classNames from 'classnames';
const scrollPlaceholder = 'conversation_list_placeholder';
interface Props {
  userInfo: UserInfo;
  receiverList?: Array<UserInfo>; // 消息接收者信息列表
  conversationList?: Array<MessageStruct>;
}
export const ConversationList: React.FC<Props> = (props: Props) => {
  const { userInfo, receiverList = [], conversationList = [] } = props;
  const ref = createRef<HTMLLIElement>();

  // 发送，接收到消息，自动滚动到底部
  useEffect(() => {
    ref?.current?.scrollIntoView();
  }, [conversationList, ref]);

  // 生成接收者信息的Map
  const receiverInfoMap = useMemo(() => {
    const map = new Map<number, UserInfo>();
    receiverList.forEach(item => {
      map.set(item.id, item);
    });
    return map;
  }, [receiverList]);

  const renderMessageContent = (data: MessageStruct) => {
    const { message, type } = data;
    let content = null;
    switch (Number(type)) {
      case MessageType.IMAGE:
        content = <img src={message} alt="" />;
        break;
      default:
        content = <pre>{message}</pre>;
    }
    return content;
  };

  return (
    <ul className={styles.conversationList}>
      {conversationList.map(conversation => {
        const { fromId } = conversation;
        // 是否是自己发出的消息
        const isSelfMessage = conversation.fromId === userInfo.id;
        return (
          <li
            key={conversation.id}
            className={classNames({
              [styles.conversation]: true,
              [styles.selfConversation]: isSelfMessage,
            })}>
            <div className={styles.left}>
              <Avatar size="small" src={isSelfMessage ? userInfo.avatar : receiverInfoMap.get(fromId)?.avatar}></Avatar>
            </div>
            <div
              className={classNames({
                [styles.right]: true,
                [styles.selfRight]: isSelfMessage,
              })}>
              <div className={styles.top}>
                <div className={styles.name}>{isSelfMessage ? userInfo.name : receiverInfoMap.get(fromId)?.name}</div>
                <div className={styles.bio}>
                  <IconCommentStroked className={styles.bioIcon} size="small" />
                  {isSelfMessage ? userInfo.bio : receiverInfoMap.get(fromId)?.bio}
                </div>
              </div>
              <div className={styles.messageWrap}>{renderMessageContent(conversation)}</div>
            </div>
          </li>
        );
      })}
      <li ref={ref} id={scrollPlaceholder} />
    </ul>
  );
};
