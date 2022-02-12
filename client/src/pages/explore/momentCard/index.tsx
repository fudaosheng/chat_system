import { Avatar, Collapsible, OverflowList } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { IconLikeThumb, IconComment } from '@douyinfe/semi-icons';
import { dateTimeFormat, formatDate } from 'common/utils';
import React, { createRef, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styles from './index.module.scss';
import { debounce } from 'lodash';
import { getLikeMomentContactList, likeMoment, MomentType, unlikeMoment } from 'common/api/moment/momentLike';
import { Editor } from 'components/editor';
import { useOnClickOutSide } from 'common/hooks/useOnClickOutSide';
import { GlobalContext } from 'common/store';
import { useUploadFiles } from 'common/hooks/useUploadFiles';
import { LikeUserList } from '../likeUserList';

interface Props {
  moment: MomentExtra;
}
export const MomentCard: React.FC<Props> = (props: Props) => {
  const {
    state: { userInfo },
  } = useContext(GlobalContext);
  const { moment } = props;
  // 是否喜欢该动态
  const [isLike, setIsLike] = useState(false);
  // 喜欢该动态的联系人列表
  const [contactListForLikeMoment, setContactListForLikeMoment] = useState<Array<UserInfo & { key: string }>>([]);
  // 评论下拉框是否显示
  const [commentCollapseIsOpen, setCommentCollapseIsOpen] = useState(false);
  const editorRef = createRef<HTMLDivElement>();
  const editorContainerRef = createRef<HTMLDivElement>();
  // 评论上传的文件列表
  const { fileList, handleRemoveImg, handleUploadSuccess } = useUploadFiles();

  useOnClickOutSide<HTMLDivElement>(editorContainerRef, () => setCommentCollapseIsOpen(false));

  useEffect(() => {
    setIsLike(moment?.like_user_ids?.some(i => i.id === userInfo.id));
  }, [moment]);

  // 获取喜欢该动态的联系人列表
  useEffect(() => {
    if(moment.id && userInfo.id) {
      getLikeMomentContactList(moment.id).then(res => {
        const newContactListForLikeMoment = res?.data || [];
        if(moment.like_user_ids.some(i => i.id === userInfo.id)) {
          newContactListForLikeMoment.unshift(userInfo);
        }
        setContactListForLikeMoment(newContactListForLikeMoment?.map(i => ({ ...i, key: String(i.id) })));
      })
    }
  }, [moment, userInfo]);

  // 点赞或取消点赞
  const handleLikeOrUnlikeMoment = debounce(
    () => {
      isLike ? unlikeMoment(moment.id, MomentType.MOMENT) : likeMoment(moment.id, MomentType.MOMENT);
      setIsLike(!isLike);
    },
    1000,
    { leading: true }
  );

  // 打开评论编辑器
  const openCommentCollapse = (e: any) => {
    setCommentCollapseIsOpen(true);
    e.stopPropagation();
  };
  return (
    <div className={styles.momentCard}>
      <div className={styles.left}>
        <Avatar className={styles.avatar} shape="square" src={moment.user_info.avatar} />
      </div>
      <div className={styles.main}>
        <div className={styles.name}>{moment?.user_info?.note || moment?.user_info?.name}</div>
        <div className={styles.content}>
          <pre>{moment.content}</pre>
        </div>
        <div className={styles.imgList}>
          {moment?.imgs_list?.map(img => (
            <div className={styles.imgItem} key={img}>
              <Avatar shape="square" src={img} />
            </div>
          ))}
        </div>
        <div className={styles.btnGroup}>
          <div className={styles.createAt}>发布时间：{formatDate(new Date(moment.create_time), dateTimeFormat)}</div>
          <div className={styles.btnGroup}>
            <IconLikeThumb
              className={classNames({
                [styles.likeBtn]: true,
                [styles.like]: isLike,
              })}
              size="large"
              onClick={handleLikeOrUnlikeMoment}
            />
            {/* <IconDislikeThumb size="large" /> */}
            <IconComment size="large" onClick={openCommentCollapse} />
          </div>
        </div>
        <Collapsible isOpen={commentCollapseIsOpen} className={styles.commendCollapse}>
          <div ref={editorContainerRef}>
            <Editor
              ref={editorRef}
              showSendButton
              placeholder="请输入评论内容"
              isFunctionTabAtBottom
              uploadProps={{
                listType: 'picture',
                action: '/api/file/user/upload/img',
                headers: {
                  Authorization: 'Bearer ' + userInfo.token,
                },
                name: 'img',
                onSuccess: handleUploadSuccess,
                onRemove: handleRemoveImg,
              }}
            />
          </div>
        </Collapsible>
        {/* // 喜欢 */}
        <LikeUserList userList={contactListForLikeMoment} />
      </div>
    </div>
  );
};
