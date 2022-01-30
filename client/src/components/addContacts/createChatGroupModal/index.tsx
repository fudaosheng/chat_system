import { Modal, Input, Upload, Avatar, Toast, Transfer, Spin } from '@douyinfe/semi-ui';
import { ModalReactProps } from '@douyinfe/semi-ui/modal';
import { makeTreeWithContactList } from 'common/api/contacts';
import { spinStyle } from 'common/constance';
import { GlobalContext } from 'common/store';
import { DefaultChatGroupAvatar } from 'components/icons';
import { UploadAvatar } from 'components/uploadAvatar';
import { hoverMask } from 'components/userInfoCard';
import React, { useContext, useEffect, useState } from 'react';
import styles from './index.module.scss';

interface Member extends Omit<DetailContactGroupInfoExtra, 'value'> {
  value: string | number;
}

export const CreateChatGroupModal: React.FC<ModalReactProps> = (props: ModalReactProps) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  // 联系人列表
  const [contactList, setContactList] = useState<Array<Member>>([]);
  // 联系人loading
  const [membersLoading, setMembersLoading] = useState(false);
  const [selectedContactList, setSelectedContactList] = useState<Array<string | number>>([]);
  const {
    state: { userInfo },
  } = useContext(GlobalContext);

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
  const handleCreateChatGroup = () => {
      if(!name || name === ' ' || name.length > 30) {
          Toast.error('name不能为空，且最长30个字符');
          return;
      }
      if(!selectedContactList.length) {
          Toast.error('请选中群成员');
          return;
      }
      console.log('------------------');
      console.log('name', name);
      console.log(selectedContactList);
      console.log('avatar', avatar);
      console.log('------------------');
      // 1. 创建群组
      // 2. 向选中的群成员发送入群申请
      // 3. 关闭弹窗
  }
  return (
    <Modal title="创建群聊" {...props} onOk={handleCreateChatGroup}>
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
              <Transfer dataSource={contactList} type="treeList" onChange={v => setSelectedContactList([...v])}></Transfer>
            </Spin>
          </div>
        </div>
      </div>
    </Modal>
  );
};
