import React, { useCallback, useContext, useMemo, useState } from 'react';
import { unionBy } from 'lodash';
import { Modal, Input, Spin, Button, Tag, Toast } from '@douyinfe/semi-ui';
import { IconPlusCircle } from '@douyinfe/semi-icons';
import { IconSearch } from '@douyinfe/semi-icons';
import { ModalReactProps } from '@douyinfe/semi-ui/modal';
import { getUserById, getUserListByName } from 'common/api/user';
import styles from './index.module.scss';
import { spinStyle } from 'common/constance';
import { UserCard } from 'components/userCard';
import { ApplyInfoModal } from '../applyInfoModal';
import { GlobalContext } from 'common/store';
import { getChatGroupById, getChatGroupListByName } from 'common/api/chatGroup';
import { batchCreateChatGroupApplyTickets } from 'common/api/chatGroupApplyTickets';

/**
 * 添加联系人或群组组件
 * @author fudaosheng
 */

interface Extra {
  type: 'contact' | 'chatGroup'
}
type Item = (UserInfo | ChatGroup) & Extra;

interface Props extends ModalReactProps {}
export const AddContactModal: React.FC<Props> = (props: Props) => {
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  const { ...respProps } = props;

  const [loading, setLoading] = useState(false);
  // 搜索到的联系人列表
  const [userList, setUserList] = useState<Array<UserInfo>>([]);
  // 搜索到的群组列表
  const [chatGroupList, setChatGroupList] = useState<Array<ChatGroup>>([]);
  // 添加人信息
  const [targetUserInfo, setTargetUserInfo] = useState<UserInfo>();
  // 申请信息moda
  const [applyModalVisible, setApplyModalVisible] = useState(false);

  // 搜索联系人
  const handleSearch = async (e: any) => {
    const keyword = e.target.value;
    if (!keyword || keyword === ' ') {
      return;
    }
    // 联系人
    const contactPromiseList = [getUserListByName(keyword)];
    // 群组
    const chatGroupPromiseList = [getChatGroupListByName(keyword)];
    // id搜索
    const id = Number(keyword);
    if (id) {
      contactPromiseList.push(getUserById(id));
      chatGroupPromiseList.push(getChatGroupById(id));
    }
    setLoading(true);
    try {
      const res = await Promise.all([Promise.all(contactPromiseList), Promise.all(chatGroupPromiseList)]);
      // 搜索到的联系人
      const [userData1, userData2] = res[0];
      const { data: userList1 = [] } = userData1;
      const { data: userList2 = [] } = userData2 || {};
      // 对根据ID搜索、name搜索进行去重
      const userList = unionBy(userList1, userList2, 'id')?.filter(i => i.id !== userInfo.id);

      // 搜索到的群组
      const [resp1, resp2] = res[1];
      const { data: chatGroupList1 } = resp1 || {};
      const { data: chatGroupList2 } = resp2 || {};
      const newChatGroupList = unionBy(chatGroupList1, chatGroupList2, 'id');

      setUserList(userList);
      setChatGroupList(newChatGroupList);
      console.log('newChatGroupList', newChatGroupList);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyContact = async (data: Item) => {
    // 添加联系人
    if (data?.type === 'contact') {
      setTargetUserInfo(data as UserInfo);
      setApplyModalVisible(true);
    } 
    else if(data?.type === 'chatGroup') {
      // 申请入群
      await batchCreateChatGroupApplyTickets(data.id, [userInfo.id], (data as ChatGroup).owner_id);
      Toast.success('入群申请已发送')
    }
  };

  const searchResultList = useMemo(() => {
    return [
      ...userList?.map(i => ({ ...i, type: 'contact' })),
      ...chatGroupList?.map(i => ({ ...i, type: 'chatGroup' })),
    ].sort((a, b) => {
      if (a.create_time && b.create_time) {
        return new Date(b.create_time).getTime() - new Date(a.create_time).getTime();
      }
      return 0;
    });
  }, [userList, chatGroupList]);

  const renderName = useCallback((data: Item) => {
    return data.type === 'chatGroup' ? (
      <>
      {data.name}
      <Tag className={styles.tag} color='blue'>群组</Tag>
      </>
    ) : data.name
  }, []);
  return (
    <>
      <Modal title="添加联系人/群组" {...respProps} footer={<></>}>
        <div className={styles.addContact}>
          <Input
            showClear
            prefix={<IconSearch />}
            placeholder="请输入用户｜群组的ID或名称搜索"
            onEnterPress={handleSearch}
          />
          <div className={styles.userList}>
            <Spin spinning={loading} style={spinStyle} childStyle={spinStyle}>
              {searchResultList.map(item => (
                <div key={`${item.type}-${item.id}`} className={styles.userItem}>
                  <UserCard userInfo={item as UserInfo} name={renderName(item as Item)} />
                  <Button
                    icon={<IconPlusCircle size="large" />}
                    type="tertiary"
                    theme="borderless"
                    onClick={() => handleApplyContact(item as Item)}
                  />
                </div>
              ))}
            </Spin>
          </div>
        </div>
      </Modal>
      <ApplyInfoModal
        key={applyModalVisible ? 1 : 0}
        targetUserInfo={targetUserInfo}
        visible={applyModalVisible}
        onCancel={() => setApplyModalVisible(false)}
      />
    </>
  );
};
