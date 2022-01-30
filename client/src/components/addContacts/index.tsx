import React, { useState } from 'react';
import { Button, Dropdown } from '@douyinfe/semi-ui';
import { ButtonProps } from '@douyinfe/semi-ui/button';
import { IconPlus } from '@douyinfe/semi-icons';
import { AddContactModal } from './addContactModal';
import { CreateChatGroupModal } from './createChatGroupModal';

export const AddButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  // 添加联系人
  const [addContactModalVisible, setAddContactModalVisible] = useState(false);
  // 创建群组
  const [createChatGroupModalVisible, setCreateChatGroupModalVisible] = useState(false);
  return (
    <>
      <Dropdown
        trigger="click"
        position={'bottom'}
        render={
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setAddContactModalVisible(true)}>添加联系人/群组</Dropdown.Item>
            <Dropdown.Item onClick={() => setCreateChatGroupModalVisible(true)}>创建群组</Dropdown.Item>
          </Dropdown.Menu>
        }>
        <Button {...props} icon={<IconPlus />}></Button>
      </Dropdown>
      <AddContactModal
        key={addContactModalVisible ? 1 : 0}
        visible={addContactModalVisible}
        onCancel={() => setAddContactModalVisible(false)}
      />
      <CreateChatGroupModal
        style={{ minWidth: 840 }}
        key={createChatGroupModalVisible ? 1 : 0}
        visible={createChatGroupModalVisible}
        onCancel={() => setCreateChatGroupModalVisible(false)}
      />
    </>
  );
};
