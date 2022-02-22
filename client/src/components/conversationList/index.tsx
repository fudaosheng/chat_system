import { CHAT_TYPE, MessageStruct, MessageType } from 'core/typings';
import React, { createRef, useEffect, useMemo } from 'react';
import { Avatar } from '@douyinfe/semi-ui';
import { IconCommentStroked } from '@douyinfe/semi-icons';
import styles from './index.module.scss';
import classNames from 'classnames';
import { batchDeleteUserImgs } from 'common/api/file';
const scrollPlaceholder = 'conversation_list_placeholder';
interface Props {
  userInfo: UserInfo;
  type: CHAT_TYPE;
  membersMap?: Map<number, UserInfo>; // 消息接收者信息列表
  conversationList?: Array<MessageStruct>;
}
export const ConversationList: React.FC<Props> = (props: Props) => {
  const { userInfo, membersMap = new Map<number, UserInfo>(), conversationList = [], type = CHAT_TYPE.CHAT } = props;
  const ref = createRef<HTMLLIElement>();

  // 发送，接收到消息，自动滚动到底部
  useEffect(() => {
    ref?.current?.scrollIntoView();
  }, [conversationList, ref]);

  // 处理消息加载成功
  const handleImageLoad = (data: MessageStruct) => {
    const { receiverId, message } = data;
    // 如果自己不是消息接收人不处理
    if(Number(receiverId) !== userInfo.id || !message || data.chatType === CHAT_TYPE.CHAT_GROUP) {
      return;
    } 
    // 自己是消息接收人，加载完成图片时删除图片
    const imageName = message?.split('/')?.pop();
    imageName && batchDeleteUserImgs([imageName]);
  }


  const renderMessageContent = (data: MessageStruct) => {
    const { message, type } = data;
    let content = null;
    switch (Number(type)) {
      case MessageType.IMAGE:
        content = <img src={message} alt="" onLoad={() => handleImageLoad(data)} />;
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
        // 消息发送人用户信息
        const sender = isSelfMessage && type === CHAT_TYPE.CHAT ? userInfo : membersMap.get(fromId);
        return (
          <li
            key={conversation.id}
            className={classNames({
              [styles.conversation]: true,
              [styles.selfConversation]: isSelfMessage,
            })}>
            <div className={styles.left}>
              <Avatar size="small" src={sender?.avatar}></Avatar>
            </div>
            <div
              className={classNames({
                [styles.right]: true,
                [styles.selfRight]: isSelfMessage,
              })}>
              <div className={styles.top}>
                <div className={styles.name}>{sender?.note || sender?.name}</div>
                <div className={styles.bio}>
                  <IconCommentStroked className={styles.bioIcon} size="small" />
                  {sender?.bio}
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
