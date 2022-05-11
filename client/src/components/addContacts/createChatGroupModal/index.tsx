import { Modal, Input, Upload, Avatar, Toast, Transfer, Spin } from '@douyinfe/semi-ui';
import { ModalReactProps } from '@douyinfe/semi-ui/modal';
import { createChatGroup } from 'common/api/chatGroup';
import { batchCreateChatGroupApplyTickets } from 'common/api/chatGroupApplyTickets';
import { makeTreeWithContactList } from 'common/api/contacts';
import { spinStyle } from 'common/constance';
import { GlobalContext } from 'common/store';
import { DefaultChatGroupAvatar } from 'components/icons';
import { UploadAvatar } from 'components/uploadAvatar';
import { hoverMask } from 'components/userInfoCard';
import React, { useContext, useEffect, useState } from 'react';
import styles from './index.module.scss';

interface Member extends Omit<DetailContactGroupInfoExtra, 'value' | 'onOk'> {
  value: string | number;
}
interface Props extends Omit<ModalReactProps, 'onOk'> {
  onOk?: () => void;
}

export const CreateChatGroupModal: React.FC<Props> = (props: Props) => {
  const { onOk, ...restProps } = props;
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  // 联系人列表
  const [contactList, setContactList] = useState<Array<Member>>([]);
  // 联系人loading
  const [membersLoading, setMembersLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedContactList, setSelectedContactList] = useState<Array<string | number>>([]);
  const {
    state: { userInfo },
  } = useContext(GlobalContext);

  // 获取联系人
  const requestContactList = async () => {
    try {
      setMembersLoading(true);
      setContactList(
        ((await makeTreeWithContactList()) || [])?.map((i: Member) => {
          if (i?.type === 'group') {
            i.value = 'group-' + i.value;
          }
          return i;
        })
      );
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo.id) {
      requestContactList();
    }
  }, [userInfo]);

  // 创建群组
  const handleCreateChatGroup = async () => {
    if (!name || name === ' ' || name.length > 30) {
      Toast.error('name不能为空，且最长30个字符');
      return;
    }
    if (!selectedContactList.length) {
      Toast.error('请选中群成员');
      return;
    }
    try {
      setModalLoading(true);
      // 1. 创建群组
      const {
        data: { id },
      } = await createChatGroup(name, avatar);
      const userIdList = selectedContactList.filter(i => typeof i === 'number') as Array<number>;
      // 2. 向选中的群成员发送入群申请
      id && (await batchCreateChatGroupApplyTickets(id, userIdList));
      Toast.success('群聊创建成功');
      // 3. 关闭弹窗
      onOk && onOk();
    } finally {
      setModalLoading(false);
    }
  };
  return (
    <Modal title="创建群聊" confirmLoading={modalLoading} {...restProps} onOk={handleCreateChatGroup}>
      <div className={styles.createChatGroup}>
        <div className={styles.item}>
          <label htmlFor="">群名称</label>
          <Input placeholder="请输入群名称" value={name} onChange={v => setName(v)} />
        </div>
        <div className={styles.item}>
          <label htmlFor="">群头像</label>
          <UploadAvatar action="" avatarProps={{ size: 'medium' }} value={avatar} onChange={v => setAvatar(v)}>
            {DefaultChatGroupAvatar}
          </UploadAvatar>
        </div>
        <div className={styles.item}>
          <label htmlFor="">群成员</label>
          <div className={styles.members}>
            <Spin spinning={membersLoading} style={spinStyle} childStyle={spinStyle}>
              <Transfer
                dataSource={contactList}
                type="treeList"
                onChange={v => setSelectedContactList([...v])}></Transfer>
            </Spin>
          </div>
        </div>
      </div>
    </Modal>
  );
};
