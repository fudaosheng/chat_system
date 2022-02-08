import { WebsocketContext } from 'core/store';
import React, { createRef, useContext, useEffect, useMemo, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
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
import { Button } from '@douyinfe/semi-ui';
import { IconChevronRight, IconChevronLeft, IconEdit } from '@douyinfe/semi-icons';
import { IDENTITY_LEVEL } from 'common/constance';
import { ReleaseAnnoucement } from './releaseAnnouncement';
import { modifyAnnouncement } from 'common/api/chatGroup';
import { getChatGroupMembers } from 'common/api/chatGroupContact';
import { MemberList } from './memberList';
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
  const [isOpen, setIsOpen] = useState(false);
  const conversationsRef = createRef<HTMLDivElement>();
  const editorRef = createRef<HTMLDivElement>();
  // 发布群公告modal
  const [releaseAnnoucementModalVisible, setReleaseAnnoucementModalVisible] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  // 群成员
  const [members, setMembers] = useState<Array<ChatGroupMember>>([])

  // 会话
  const chat = useMemo(
    () => chatList.find(i => i.id === Number(chatId) && i.type === chatType),
    [chatList, chatId, chatType]
  );

  const membersMap = useMemo(() => {
    return new Map(chat?.members?.map(i => [i.id, i]));
  }, []);

      // 监听鼠标移动，处理消息是否已读
  useEffect(() => {
    if (!(conversationsRef?.current && chat?.id)) {
      return;
    }
    const updateLastReadedMessageIndex = debounce(() => {
      dispatch(WebsocketAction.updateLastReadedMessageIndex(chat?.id, chatType));
    }, debounceGap);
    conversationsRef.current.addEventListener('mousemove', updateLastReadedMessageIndex);
    return () => conversationsRef.current?.removeEventListener('mousemove', updateLastReadedMessageIndex);
  }, [conversationsRef]);

    // 获取群成员
    useEffect(() => {
      if(chatId && chatType === CHAT_TYPE.CHAT_GROUP) {
        getChatGroupMembers(Number(chatId)).then(res => {
          setMembers(res?.data || []);
          dispatch(WebsocketAction.updateChatGroupMembers(Number(chatId), res?.data || []));
        })
      }
    }, [chatId, chatType]);

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
    dispatch(WebsocketAction.append(message.receiverId, chatType, message));
  };

  // 处理编辑器回车事件
  const handleEnterPress = (e: any) => {
    // 阻止换行
    e?.preventDefault();
    handleSendMessage(e.target.innerHTML);
    // 清空内容
    e.target.innerHTML = '';
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

  // 修改群公告
  const handleReleaseAnnoucement = async (annoucement: string) => {
    if (!(chat?.id && annoucement)) {
      return;
    }
    try {
      setBtnLoading(true);
      await modifyAnnouncement(chat?.id, annoucement);
      dispatch(WebsocketAction.updateChatGroupAnnouncement(chat.id, annoucement));
    } finally {
      setBtnLoading(false);
      setReleaseAnnoucementModalVisible(false);
    }
  };

  return (
    <div className={styles.conversationPage}>
      <div className={styles.conversations} ref={conversationsRef}>
        <div className={styles.chatName}>
          <div>{chatName}</div>
          <div className={styles.collapseWrapper}>
            {chat?.type === CHAT_TYPE.CHAT_GROUP &&
              (isOpen ? (
                <Button theme="borderless" icon={<IconChevronRight size="large" />} onClick={() => setIsOpen(false)} />
              ) : (
                <Button theme="borderless" icon={<IconChevronLeft size="large" />} onClick={() => setIsOpen(true)} />
              ))}
          </div>
        </div>
        <div className={styles.conversationList}>
          <ConversationList userInfo={userInfo} membersMap={membersMap} conversationList={chat?.conversations} />
        </div>
        <div className={styles.footer}>
          {/* <div className={styles.funtionNav}>
          <IconEmoji size="large" />
        </div> */}
          <div className={styles.editor}>
            <Editor
              ref={editorRef}
              className={styles.textArea}
              onEnterPress={handleEnterPress}
              onUploadImageSuccess={url => handleSendMessage(url, MessageType.IMAGE)}
            />
          </div>
        </div>
      </div>
      <CSSTransition in={isOpen} timeout={300} classNames="slideInRight" unmountOnExit>
        <div className={styles.sider}>
          <div className={styles.announcementWrapper}>
            <div className={styles.title}>群公告</div>
            <div className={styles.announcement}>
              <pre>{chat?.chatGroupInfo?.announcement || '暂无群公告'}</pre>
              {chat?.chatGroupInfo?.identity && chat?.chatGroupInfo?.identity !== IDENTITY_LEVEL.DEFAULT && (
                <Button
                  type="tertiary"
                  theme="borderless"
                  icon={<IconEdit />}
                  className={styles.btn}
                  onClick={() => setReleaseAnnoucementModalVisible(true)}
                />
              )}
              <ReleaseAnnoucement
                confirmLoading={btnLoading}
                visible={releaseAnnoucementModalVisible}
                onCancel={() => setReleaseAnnoucementModalVisible(false)}
                onOk={handleReleaseAnnoucement}
              />
            </div>
          </div>
          <div className={styles.membersWrapper}>
            <div className={styles.title}>群成员</div>
            <div className={styles.members}>
              <MemberList members={members} />
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};
