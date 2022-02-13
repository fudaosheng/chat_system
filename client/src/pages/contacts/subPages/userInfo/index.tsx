import { Spin, Avatar, Button, Toast } from '@douyinfe/semi-ui';
import { editContactNote, getContactInfo } from 'common/api/contacts';
import { IconComment, IconEdit, IconGlobe } from '@douyinfe/semi-icons';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styles from './index.module.scss';
import { SEX } from 'common/constance';
import { formatDate } from 'common/utils';
import { Input } from '@douyinfe/semi-ui/lib/es/input';
import { WebsocketContext } from 'core/store';
import { WebsocketAction } from 'core/store/action';
import { CHAT_TYPE } from 'core/typings';
import { GlobalContext } from 'common/store';
const day = 1000 * 60 * 60 * 24;

interface Props {
  onChange?: () => void; // 用户信息变化
}
export const UserInfo: React.FC<Props> = (props: Props) => {
  const { userId } = useParams<any>();
  const history = useHistory();
  const { dispatch } = useContext(WebsocketContext);
  const { onChange } = props;
  const [contactInfo, setContactInfo] = useState<UserInfo>({} as UserInfo);
  const [loading, setLoading] = useState(false);
  // 编辑好友备注
  const [editNote, setEditNote] = useState(false);

  const getContactInfoRequest = async () => {
    setLoading(true);
    try {
      const { data } = await getContactInfo(userId);
      setContactInfo(data);
    } finally {
      setLoading(false);
    }
  };

  // 查询联系人的详细信息
  useEffect(() => {
    if (!userId) {
      return;
    }
    getContactInfoRequest();
  }, [userId]);

  // 保存好友备注
  const handleSaveNote = async (e: any) => {
    const value = e.target.value;
    if (!value || value === ' ') {
      return;
    }
    try {
      await editContactNote(contactInfo.id, value);
      Toast.success('修改好友备注成功');
      setContactInfo({ ...contactInfo, note: value });
      setEditNote(false);
      //更新好友列表
      onChange && onChange();
    } finally {
    }
  };

  // 创建单聊会话
  const handleCreateChat = () => {
    if (!contactInfo.id) {
      return;
    }
    dispatch(WebsocketAction.createChat(contactInfo.id, CHAT_TYPE.CHAT, [contactInfo]));
    // 跳转到会话列表
    history.push(`/chat/${CHAT_TYPE.CHAT}/${contactInfo.id}`);
  };

  // 渲染其他用户信息
  const renderOtherInfo = () => {
    const { birthday, sex, phone_num, id, name, note, create_time } = contactInfo;
    const sexInfo = sex ? (sex === SEX.MAN ? '男' : '女') : undefined;
    let friendTime;
    if (create_time) {
      friendTime = ((new Date().getTime() - new Date(create_time).getTime()) / day).toFixed(1);
    }
    return (
      <>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>ID</span>
          <span className={styles.info}>{id || '请完善信息'}</span>
        </div>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>昵称</span>
          <span className={styles.info}>{name || '请完善信息'}</span>
        </div>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>备注</span>
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
          <span className={styles.label}>手机</span>
          <span className={styles.info}>{phone_num || '请完善信息'}</span>
        </div>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>性别</span>
          <span className={styles.info}>{sexInfo || '请完善信息'}</span>
        </div>
        <div className={styles.otherInfoItem}>
          <span className={styles.label}>生日</span>
          <span className={styles.info}>{formatDate(new Date(birthday || ''), 'yyyy-MM-dd') || '请完善信息'}</span>
        </div>
        {friendTime && (
          <div className={styles.otherInfoItem}>
            <span className={styles.label}>好友时长</span>
            <span className={styles.info}>{friendTime}天</span>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.userInfo}>
      <Spin spinning={loading} wrapperClassName={styles.spin}>
        <div className={styles.top}>
          <div className={styles.avatar}>
            <Avatar src={contactInfo.avatar} size="large" />
          </div>
          <div className={styles.main}>
            <div className={styles.name}>{contactInfo?.note || contactInfo.name}</div>
            <div className={styles.function}>
              <Button icon={<IconComment />} type="tertiary" theme="borderless" onClick={handleCreateChat} />
              <Button
                icon={<IconGlobe />}
                type="tertiary"
                theme="borderless"
                onClick={() => history.push(`/explore?uid=${contactInfo.id}`)}
              />
            </div>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.otherInfo}>{renderOtherInfo()}</div>
        </div>
      </Spin>
    </div>
  );
};
