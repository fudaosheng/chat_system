import React, { useEffect, useState } from 'react';
import { Modal, Select, TextArea, Toast } from '@douyinfe/semi-ui';
import { UserCard } from 'components/userCard';
import { ModalProps } from '@douyinfe/semi-foundation/lib/es/modal/modalFoundation';
import { getContactGroupList } from 'common/api/contactGroup';
import styles from './index.module.scss';
import { addContact } from 'common/api/applyContactTicket';
import { Input } from '@douyinfe/semi-ui/lib/es/input';

const eleStyle = { width: 200 };

interface Props extends ModalProps {
  targetUserInfo: UserInfo | undefined;
}
export const ApplyInfoModal: React.FC<Props> = (props: Props) => {
  const { targetUserInfo, visible, ...restProps } = props;
  const [contactGroupList, setContactGroupList] = useState<Array<ContactGroupExtra>>([]);
  // 申请信息
  const [message, setMessage] = useState('');
  // 要添加的分组Id
  const [contactGroup, setContactGroup] = useState<number | undefined>();
  // 好友备注
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // 获取联系人列表
  const getContactGroupListRequest = async (needLoading = true) => {
    try {
      const { data } = await getContactGroupList();
      // 对联系人数据进行处理
      const newContactGroupList = data?.map(item => ({
        ...item,
        label: item.name,
        value: item.id,
        key: String(item.id),
      }));
      setContactGroupList(newContactGroupList);
      setContactGroup(newContactGroupList?.[0]?.id);
    } finally {
    }
  };

  useEffect(() => {
    if (!visible) {
      return;
    }
    getContactGroupListRequest();
  }, [visible]);

  // 申请好友
  const handleApplyContact = async () => {
    // 必填信息效验
    if (!targetUserInfo?.id) {
      Toast.error('添加人信息不存在');
      return;
    }
    if (!contactGroup) {
      Toast.error('必须要选择分组');
      return;
    }
    setLoading(true);
    try {
      await addContact({
        message,
        note,
        userId: targetUserInfo.id,
        group_id: contactGroup,
      });
      Toast.info('申请信息已发送~');
      // 关闭弹窗
      restProps?.onCancel && restProps?.onCancel(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} title="请填写申请信息" okText="发送" {...restProps} onOk={handleApplyContact}>
      <UserCard userInfo={targetUserInfo as UserInfo} />
      <div className={styles.tip}>验证人需要验证您的身份，请输入您的请求信息</div>
      <TextArea rows={2} maxCount={100} value={message} onChange={v => setMessage(v)} />
      <div className={styles.item}>
        <label>分组：</label>
        <Select
          value={contactGroup}
          style={eleStyle}
          optionList={contactGroupList}
          onChange={v => setContactGroup(v as number)}></Select>
      </div>
      <div className={styles.item}>
        <label>备注：</label>
        <Input
          value={note}
          style={eleStyle}
          onChange={v => setNote(v)} />
      </div>
    </Modal>
  );
};
