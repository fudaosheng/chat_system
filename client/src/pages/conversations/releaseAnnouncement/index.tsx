import { Modal } from '@douyinfe/semi-ui';
import { ModalReactProps } from '@douyinfe/semi-ui/modal';
import { Editor } from 'components/editor';
import React from 'react';

interface Props extends ModalReactProps {}
export const ReleaseAnnoucement: React.FC<Props> = (props: Props) => {
  return (
    <Modal title="发布群公告" okText="发布" {...props}>
      <Editor couldUploadImage={false} />
    </Modal>
  );
};
