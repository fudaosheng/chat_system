import React, { useState } from 'react';
import { Button, Dropdown } from '@douyinfe/semi-ui';
import { ButtonProps } from '@douyinfe/semi-ui/button';
import { IconPlus } from '@douyinfe/semi-icons';
import { AddContactModal } from './addContactModal';

export const AddButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  const [addContactModalVisible, setAddContactModalVisible] = useState(false);
  return (
    <>
      <Dropdown
        trigger="click"
        position={'bottom'}
        render={
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setAddContactModalVisible(true)}>添加联系人/群组</Dropdown.Item>
            <Dropdown.Item>创建群组</Dropdown.Item>
          </Dropdown.Menu>
        }>
        <Button {...props} icon={<IconPlus />}></Button>
      </Dropdown>
      <AddContactModal visible={addContactModalVisible} onCancel={() => setAddContactModalVisible(false)} />
    </>
  );
};
