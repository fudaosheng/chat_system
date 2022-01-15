import React, { useContext, useState } from 'react';
import { unionBy } from 'lodash';
import { Modal, Input, Spin, Button } from '@douyinfe/semi-ui';
import { IconPlusCircle } from '@douyinfe/semi-icons';
import { IconSearch } from '@douyinfe/semi-icons';
import { ModalReactProps } from '@douyinfe/semi-ui/modal';
import { getUserById, getUserListByName } from 'common/api/user';
import styles from './index.module.scss';
import { spinStyle } from 'common/constance';
import { UserCard } from 'components/userCard';
import { ApplyInfoModal } from '../applyInfoModal';
import { GlobalContext } from 'common/store';

interface Props extends ModalReactProps {}
export const AddContactModal: React.FC<Props> = (props: Props) => {
  const { state: { userInfo } } = useContext(GlobalContext);
  const { ...respProps } = props;

  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<Array<UserInfo>>([]);
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
    // 搜索联系人
    const contactPromiseList = [getUserListByName(keyword)];
    // id搜索
    if (Number(keyword)) {
      contactPromiseList.push(getUserById(Number(keyword)));
    }
    setLoading(true);
    try {
      const res = await Promise.all(contactPromiseList);
      const [userData1, userData2] = res;
      const { data: userList1 = [] } = userData1;
      const { data: userList2 = [] } = userData2 || {};
      // 对根据ID搜索、name搜索进行去重
      const userList = unionBy(userList1, userList2, 'id')?.filter(i => i.id !== userInfo.id);
      setUserList(userList);
    } finally {
      setLoading(false);
    }
  };

  // 添加联系人
  const handleApplyContact = (targetUserInfo: UserInfo) => {
    setTargetUserInfo(targetUserInfo);
    setApplyModalVisible(true);
  };
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
              {userList.map(item => (
                <div key={item.id} className={styles.userItem}>
                  <UserCard userInfo={item} />
                  <Button
                    icon={<IconPlusCircle size="large" />}
                    type="tertiary"
                    theme="borderless"
                    onClick={() => handleApplyContact(item)}
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
