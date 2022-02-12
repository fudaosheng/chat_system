import { Modal } from '@douyinfe/semi-ui';
import { ModalReactProps } from '@douyinfe/semi-ui/modal';
import { createMoment } from 'common/api/moment/moments';
import { useUploadFiles } from 'common/hooks/useUploadFiles';
import { GlobalContext } from 'common/store';
import { Editor } from 'components/editor';
import { UploadImages } from 'components/uploadImages';
import React, { createRef, useContext, useState } from 'react';
import styles from './index.module.scss';
/**
 *
 * @returns 发表动态组件
 * @auther fudaosheng
 */
interface Props extends Omit<ModalReactProps, 'onOk'> {
  onOk?: () => void;
}
export const ReleaseMoment: React.FC<Props> = (props: Props) => {
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  const { onOk, ...restProps } = props;
  const editorRef = createRef<HTMLDivElement>();
  const [content, setContent] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  // 使用上传图片hooks
  const { fileList, handleUploadSuccess, handleRemoveImg } = useUploadFiles();
  
  // 发布动态
  const handleReleaseMoment = async () => {
    try {
      setBtnLoading(true);
      await createMoment(
        content,
        fileList?.map?.(i => i?.response?.data?.url)
      );
      onOk && onOk();
    } finally {
      setBtnLoading(false);
    }
  };
  
  return (
    <Modal
      title="发表动态"
      okText="发布"
      okButtonProps={{ disabled: !content }}
      confirmLoading={btnLoading}
      {...restProps}
      onOk={handleReleaseMoment}>
      <div className={styles.content}>
        <Editor
          wrapperClassName={styles.editor}
          isFunctionTabAtBottom
          ref={editorRef}
          placeholder="这一刻的想法……"
          onChange={v => {
            console.log(v);
            setContent(v)
          }}
        />
        <UploadImages
          action="/api/file/user/upload/img"
          headers={{
            Authorization: 'Bearer ' + userInfo.token,
          }}
          name="img"
          className={styles.uploadImages}
          onSuccess={handleUploadSuccess}
          onRemove={handleRemoveImg}
        />
      </div>
    </Modal>
  );
};
