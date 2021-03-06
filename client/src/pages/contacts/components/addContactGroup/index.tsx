import React, { useCallback, useState } from 'react';
import { Button, Modal, Input, Toast } from '@douyinfe/semi-ui';
import styles from './index.module.scss';
import { createContactGroup } from 'common/api/contactGroup';

interface Porps {
  onChange: () => void; //添加联系人成功，触发更新
}

export const AddContactGroup: React.FC<Porps> = (props: Porps) => {
  const { onChange } = props;
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  //添加分组
  const handleSaveGroup = useCallback(async () => {
    // 效验无效输入
    if (!value || value === ' ') {
      return;
    }
    setLoading(true);
    try {
      await createContactGroup(value);
      onChange();
      Toast.success('添加分组成功');
      setVisible(false);
    } finally {
      setLoading(false);
    }
  }, [value]);
  return (
    <div className={styles.addGroupWrap}>
      <Button className={styles.addGroup} theme="borderless" type="tertiary" onClick={() => setVisible(true)}>
        添加分组
      </Button>
      <Modal
        confirmLoading={loading}
        visible={visible}
        title="添加分组"
        onCancel={() => setVisible(false)}
        onOk={handleSaveGroup}>
        <Input placeholder="请输入分组名称" value={value} onChange={v => setValue(v)} />
      </Modal>
    </div>
  );
};
