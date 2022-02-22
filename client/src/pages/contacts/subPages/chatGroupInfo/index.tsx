import { Spin, Avatar, Button, Toast } from '@douyinfe/semi-ui';
import { editContactNote } from 'common/api/contacts';
import { IconComment, IconEdit, IconGlobe } from '@douyinfe/semi-icons';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styles from './index.module.scss';
import { identityLevelMap, SEX } from 'common/constance';
import { dateTimeFormat, formatDate } from 'common/utils';
import { Input } from '@douyinfe/semi-ui/lib/es/input';
import { WebsocketContext } from 'core/store';
import { WebsocketAction } from 'core/store/action';
import { getChatGroupDetailInfo } from 'common/api/chatGroup';
import { modifyChatGroupNote } from 'common/api/chatGroupContact';
import { CHAT_TYPE } from 'core/typings';
const day = 1000 * 60 * 60 * 24;

interface Props {}
export const ChatGroupInfo: React.FC<Props> = (props: Props) => {
  const { chatGroupId } = useParams<any>();
  const history = useHistory();
  const { dispatch } = useContext(WebsocketContext);
  const [chatGroupInfo, setChatGroupInfo] = useState<ChatGroupExtra>({} as ChatGroupExtra);
  const [loading, setLoading] = useState(false);
  // 编辑好友备注
  const [editNote, setEditNote] = useState(false);

  const getChatGroupDetailInfoRequest = async () => {
    setLoading(true);
    try {
      const { data } = await getChatGroupDetailInfo(Number(chatGroupId));
      setChatGroupInfo(data);
    } finally {
      setLoading(false);
    }
  };

  // 查询联系人的详细信息
  useEffect(() => {
    if (!chatGroupId) {
      return;
    }
    getChatGroupDetailInfoRequest();
  }, [chatGroupId]);

  // 保存好友备注
  const handleSaveNote = async (e: any) => {
    const value = e.target.value;
    if (!value || value === ' ') {
      return;
    }
    try {
      await modifyChatGroupNote(chatGroupInfo.id, value);
      Toast.success('修改好友备注成功');
      setChatGroupInfo({ ...chatGroupInfo, note: value });
      setEditNote(false);
    } finally {
    }
  };

  // 创建聊天会话
  const handleCreateChat = () => {
    if (!chatGroupInfo.id) {
      return;
    }
    // todo: 获取群成员
    dispatch(WebsocketAction.createChat(chatGroupInfo.id, CHAT_TYPE.CHAT_GROUP, [], chatGroupInfo));
    // // 跳转到会话列表
    history.push(`/chat/${CHAT_TYPE.CHAT_GROUP}/${chatGroupInfo.id}`);
  };

  // 渲染其他用户信息
  const renderOtherInfo = () => {
    const { id, name, note, create_time, announcement, identity } = chatGroupInfo;
    return (
      <>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>群ID</span>
          <span className={styles.info}>{id || '请完善信息'}</span>
        </div>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>群名称</span>
          <span className={styles.info}>{name || '请完善信息'}</span>
        </div>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>群公告</span>
          <span className={styles.info}>{announcement || '暂无群公告'}</span>
        </div>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>创建时间</span>
          <span className={styles.info}>{formatDate(new Date(create_time), dateTimeFormat)}</span>
        </div>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>我的群名片</span>
          {editNote ? (
            <Input
              placeholder="请输入好友备注"
              className={styles.input}
              onBlur={() => setEditNote(false)}
              onEnterPress={handleSaveNote}
            />
          ) : (
            <div className={styles.wrap}>
              <span className={styles.info}>{note || '请完善信息'}</span>
              <Button
                icon={<IconEdit size="small" />}
                type="tertiary"
                theme="borderless"
                onClick={e => setEditNote(true)}
              />
            </div>
          )}
        </div>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>我的群身份</span>
          <span className={styles.info}>{identityLevelMap.get(identity)}</span>
        </div>
      </>
    );
  };

  return (
    <div className={styles.userInfo}>
      <Spin spinning={loading} wrapperClassName={styles.spin}>
        <div className={styles.top}>
          <div className={styles.avatar}>
            <Avatar src={chatGroupInfo.avatar} size="large" />
          </div>
          <div className={styles.main}>
            <div className={styles.name}>{chatGroupInfo.name}</div>
            <div className={styles.id}>群号：{chatGroupInfo.id}</div>
            <div className={styles.function}>
              <Button icon={<IconComment />} type="tertiary" theme="borderless" onClick={handleCreateChat} />
            </div>
          </div>
          {/* <div className={styles.setting}>设置</div> */}
        </div>
        <div className={styles.main}>
          <div className={styles.otherInfo}>{renderOtherInfo()}</div>
        </div>
      </Spin>
    </div>
  );
};
