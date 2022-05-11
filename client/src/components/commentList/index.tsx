import { dateTimeFormat, formatDate } from 'common/utils';
import React, { createRef, useContext, useEffect, useMemo, useState } from 'react';
import { Collapsible, Toast } from '@douyinfe/semi-ui';
import styles from './index.module.scss';
import { Editor } from 'components/editor';
import { GlobalContext } from 'common/store';
import { useUploadFiles } from 'common/hooks/useUploadFiles';
import { useOnClickOutside } from 'common/hooks/useOnClickOutside';
import classNames from 'classnames';

export interface OnSubmitCommentParams {
  content: string;
  parent_id?: number; //父评论ID
  imgs_list?: Array<string>;
}
interface Props {
  isOpen?: boolean;
  className?: string;
  commentList: Array<CommentExtra>;
  onSubmitComment?: (args: OnSubmitCommentParams) => Promise<void>;
  onClickEditorOutside?: () => void;
}

export const CommentList: React.FC<Props> = (props: Props) => {
  const {
    state: { userInfo },
  } = useContext(GlobalContext);

  const { className = '', commentList = [], isOpen, onClickEditorOutside, onSubmitComment } = props;
  const editorRef = createRef<HTMLDivElement>();
  const editorContainerRef = createRef<HTMLDivElement>();
  // 评论内容
  const [content, setContent] = useState('');
  // 评论下拉框是否显示
  const [commentCollapseIsOpen, setCommentCollapseIsOpen] = useState(isOpen);
  // 按钮loading
  const [btnLoading, setBtnLoading] = useState(false);
  // 编辑器提示文案
  const [placeholder, setPlaceholder] = useState('请输入评论内容');
  // 评论上传的文件列表
  const { fileList, handleRemoveImg, handleUploadSuccess } = useUploadFiles();
  // 点击的评论
  const [activeComment, setActiveComment] = useState<CommentExtra>();

  // 评论id和评论内容的映射
  const commentMap = useMemo(() => {
    const map = new Map<number, CommentExtra>();
    commentList?.forEach(comment => {
      map.set(comment.id, comment);
    });
    return map;
  }, [commentList]);

  useOnClickOutside<HTMLDivElement>(editorContainerRef, () => {
    setCommentCollapseIsOpen(false);
    onClickEditorOutside && onClickEditorOutside();
    setActiveComment(undefined);
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
      //有parent_id就是回复评论，没有是对动态评论
      await onSubmitComment({
        content,
        imgs_list: imgList.length ? imgList : undefined,
        parent_id: activeComment?.id,
      });
      Toast.success('评论成功');
      setCommentCollapseIsOpen(false);
    } finally {
      setBtnLoading(false);
    }
  };

  // 回复评论
  const handleClick = (e: any, item: CommentExtra) => {
    setActiveComment(item);
    setCommentCollapseIsOpen(true);
    setPlaceholder(`回复${item?.user_info?.note || item?.user_info?.name || userInfo?.name}`);
    editorRef?.current?.focus();
    e.stopPropagation();
  };

  return (
    <div
      className={classNames({
        [styles.commentListWrapper]: true,
        [className]: true,
        [styles.padding]: commentList.length || commentCollapseIsOpen,
      })}>
      <div className={styles.commentList}>
        {commentList.map(item => {
          // 没有user_info信息则说明是自己的评论
          const realUserInfo = item?.user_info || userInfo;

          const parentComment = item.parent_id ? commentMap.get(item.parent_id) : undefined;
          const parentCommentUserInfo = parentComment?.user_info || userInfo;
          return (
            <div key={item.id} className={styles.comment} onClick={e => handleClick(e, item)}>
              <div className={styles.profile}>
                <p className={styles.name}>
                  {realUserInfo?.note || realUserInfo?.name}
                  {parentComment ? (
                    <>
                      <span className={styles.reply}>回复</span>
                      {parentCommentUserInfo?.note || parentCommentUserInfo?.name}
                      ：
                    </>
                  ) : (
                    '：'
                  )}
                </p>
                {/* <p>{formatDate(new Date(item.create_time), dateTimeFormat)}</p> */}
              </div>
              <div className={styles.main}>
                <p>{item.content}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Collapsible isOpen={commentCollapseIsOpen} className={styles.commendCollapse}>
        <div ref={editorContainerRef}>
          <Editor
            wrapperClassName={styles.editor}
            ref={editorRef}
            showSendButton
            placeholder={placeholder}
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
