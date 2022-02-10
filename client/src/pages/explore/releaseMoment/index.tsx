import { Modal } from '@douyinfe/semi-ui';
import { ModalReactProps } from '@douyinfe/semi-ui/modal';
import { FileItem } from '@douyinfe/semi-ui/upload';
import { batchDeleteUserImgs } from 'common/api/file';
import { createMoment } from 'common/api/moment/moments';
import { GlobalContext } from 'common/store';
import { Editor } from 'components/editor';
import { UploadImages } from 'components/uploadImages';
import { differenceBy } from 'lodash';
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
  const [fileList, setFileList] = useState<Array<FileItem>>([]);
  const [content, setContent] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  // 图片上传成功的回调
  const handleUploadSuccess = (responseBody: object, file: File, _fileList: Array<FileItem>) => {
    setFileList(_fileList);
  };
  // 移除图片的回调
  const handleRemoveImg = (currentFile: File, _fileList: Array<FileItem>, currentFileItem: FileItem) => {
    // 删除移除的图片
    const needDeleteFiles = differenceBy(fileList, _fileList, 'uid');
    console.log('needDeleteFiles', needDeleteFiles);

    if (needDeleteFiles?.length) {
      batchDeleteUserImgs(needDeleteFiles?.map(i => i.response?.data?.url?.split('/')?.pop()));
    }
    setFileList(_fileList);
  };
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
          className={styles.editor}
          couldUploadImage={false}
          ref={editorRef}
          placeholder="这一刻的想法……"
          onChange={v => setContent(v)}
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
