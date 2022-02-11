import { Modal } from '@douyinfe/semi-ui';
import { ModalReactProps } from '@douyinfe/semi-ui/modal';
import { Editor } from 'components/editor';
import React from 'react';
import { createRef } from 'react';

interface Props extends Omit<ModalReactProps, 'onOk'> {
  onOk: (announcement: string) => void;
}
export const ReleaseAnnoucement: React.FC<Props> = (props: Props) => {
  const { onOk, ...restProps } = props;
  const editorRef = createRef<HTMLDivElement>();
  return (
    <Modal title="发布群公告" okText="发布" {...restProps} onOk={() => onOk(editorRef?.current?.innerText || '')}>
      <Editor
        ref={editorRef}
        placeholder="请输入群公告内容"
      />
    </Modal>
  );
};
