import { dateTimeFormat, formatDate } from 'common/utils';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { Collapsible, Toast } from '@douyinfe/semi-ui';
import styles from './index.module.scss';
import { Editor } from 'components/editor';
import { GlobalContext } from 'common/store';
import { useUploadFiles } from 'common/hooks/useUploadFiles';
import { useOnClickOutside } from 'common/hooks/useOnClickOutside';

interface Props {
  isOpen?: boolean;
  className?: string;
  commentList: Array<CommentExtra>;
  onSubmitComment?: (content: string, imgs_list?: Array<string>) => Promise<void>;
  onClickEditorOutside?: () => void;
}

export const CommentList: React.FC<Props> = (props: Props) => {
  const {
    state: { userInfo },
  } = useContext(GlobalContext);

  const { className = '', commentList = [], isOpen, onClickEditorOutside, onSubmitComment } = props;
  const editorRef = createRef<HTMLDivElement>();
  const editorContainerRef = createRef<HTMLDivElement>();
  const [content, setContent] = useState('');
  // 评论下拉框是否显示
  const [commentCollapseIsOpen, setCommentCollapseIsOpen] = useState(isOpen);
  const [btnLoading, setBtnLoading] = useState(false);
  // 评论上传的文件列表
  const { fileList, handleRemoveImg, handleUploadSuccess } = useUploadFiles();

  useOnClickOutside<HTMLDivElement>(editorContainerRef, () => {
    setCommentCollapseIsOpen(false);
    onClickEditorOutside && onClickEditorOutside();
  });

  useEffect(() => {
    setCommentCollapseIsOpen(isOpen);
  }, [isOpen]);

  // 提交评论
  const handleSubmitComment = async () => {
    if (!onSubmitComment) {
      return;
    }
    const imgList = fileList?.map(i => i?.response?.data?.url);
    try {
      setBtnLoading(true);
      await onSubmitComment(content, imgList.length ? imgList : undefined);
      Toast.success('评论成功');
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className={`${styles.commentList} ${className}`}>
      {commentList.map(item => (
        <div key={item.id} className={styles.comment}>
          <div className={styles.profile}>
            <p className={styles.name}>{item.user_info?.note || item?.user_info.name}：</p>
            {/* <p>{formatDate(new Date(item.create_time), dateTimeFormat)}</p> */}
          </div>
          <div className={styles.main}>
            <p>{item.content}</p>
          </div>
        </div>
      ))}
      <Collapsible isOpen={commentCollapseIsOpen} className={styles.commendCollapse}>
        <div ref={editorContainerRef}>
          <Editor
            ref={editorRef}
            showSendButton
            placeholder="请输入评论内容"
            isFunctionTabAtBottom
            // uploadProps={{
            //   listType: 'picture',
            //   action: '/api/file/user/upload/img',
            //   headers: {
            //     Authorization: 'Bearer ' + userInfo.token,
            //   },
            //   name: 'img',
            //   onSuccess: handleUploadSuccess,
            //   onRemove: handleRemoveImg,
            // }}
            onChange={v => setContent(v)}
            sendButtomProps={{ disabled: !content, loading: btnLoading }}
            onSend={handleSubmitComment}
          />
        </div>
      </Collapsible>
    </div>
  );
};
