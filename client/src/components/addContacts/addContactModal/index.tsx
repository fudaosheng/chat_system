import React from 'react';
import { Modal, Input } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { ModalReactProps } from '@douyinfe/semi-ui/modal';

interface Props extends ModalReactProps {}
export const AddContactModal: React.FC<Props> = (props: Props) => {
  const { ...respProps } = props;

  const handleSearch = (e: any) => {
    const keyword = e.target.value;
    console.log(keyword);
  };
  return (
    <Modal title="添加联系人/群组" {...respProps} footer={<></>}>
      <div>
        <Input
          showClear
          prefix={<IconSearch />}
          placeholder="请输入用户｜群组的ID或名称搜索"
          onEnterPress={handleSearch}
        />
      </div>
    </Modal>
  );
};
