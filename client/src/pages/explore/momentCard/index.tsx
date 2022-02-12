import { Avatar, Toast } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { IconLikeThumb, IconComment } from '@douyinfe/semi-icons';
import { dateTimeFormat, formatDate } from 'common/utils';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import styles from './index.module.scss';
import { debounce } from 'lodash';
import { getLikeMomentContactList, likeMoment, MomentType, unlikeMoment } from 'common/api/moment/momentLike';
import { GlobalContext } from 'common/store';
import { LikeUserList } from '../likeUserList';
import { getCommentList, submitComment } from 'common/api/moment/momentComment';
import { CommentList, OnSubmitCommentParams } from 'components/commentList';

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
  // 评论列表
  const [commentList, setCommentList] = useState<Array<CommentExtra>>([]);
  // 是否打开评论编辑器
  const [commentCollapseIsOpen, setCommentCollapseIsOpen] = useState(false);

  useEffect(() => {
    setIsLike(moment?.like_user_ids?.some(i => i.id === userInfo.id));
  }, [moment]);

  const fetchCommentList = () => {
    getCommentList(moment.id).then(res => {
      setCommentList(res.data || []);
    });
  }

  // 获取喜欢该动态的联系人列表
  useEffect(() => {
    if (moment.id && userInfo.id) {
      // 获取点赞信息
      getLikeMomentContactList(moment.id).then(res => {
        const newContactListForLikeMoment = res?.data || [];
        if (moment.like_user_ids.some(i => i.id === userInfo.id)) {
          newContactListForLikeMoment.unshift(userInfo);
        }
        setContactListForLikeMoment(newContactListForLikeMoment?.map(i => ({ ...i, key: String(i.id) })));
      });
      // 获取评论信息
      fetchCommentList();
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

  // 提交评论
  const handleSubmitComment = async ({ content, imgs_list, parent_id }: OnSubmitCommentParams) => {
    try {
      await submitComment({
        momentId: moment.id,
        content,
        imgs_list,
        parent_id
      });
      // 从新拉取评论
      fetchCommentList();
    } finally {
    }
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
        <div className={styles.btnGroupWrapper}>
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

        {/* // 喜欢 */}
        {contactListForLikeMoment.length ? <LikeUserList userList={contactListForLikeMoment} /> : null}
        {/* 评论 */}
        <CommentList
          commentList={commentList}
          className={styles.commentList}
          isOpen={commentCollapseIsOpen}
          onClickEditorOutside={() => setCommentCollapseIsOpen(false)}
          onSubmitComment={handleSubmitComment}
        />
      </div>
    </div>
  );
};
