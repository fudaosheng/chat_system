import { Modal } from '@douyinfe/semi-ui';
import { ModalReactProps } from '@douyinfe/semi-ui/modal';
import { Editor } from 'components/editor';
import { UploadImages } from 'components/uploadImages';
import React, { createRef } from 'react';
import styles from './index.module.scss';
/**
 *
 * @returns 发表动态组件
 * @auther fudaosheng
 */
interface Props extends ModalReactProps {}
export const ReleaseMoment: React.FC<Props> = (props: Props) => {
  const editorRef = createRef<HTMLDivElement>();
  return (
    <Modal title="发表动态" okText="发布" {...props}>
      <div className={styles.content}>
        <Editor className={styles.editor} couldUploadImage={false} ref={editorRef} placeholder="这一刻的想法……" />
        <UploadImages action='' className={styles.uploadImages} />
      </div>
    </Modal>
  );
};
