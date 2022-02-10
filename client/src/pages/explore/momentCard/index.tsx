import { Avatar, Collapsible } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { IconLikeThumb, IconComment } from '@douyinfe/semi-icons';
import { dateTimeFormat, formatDate } from 'common/utils';
import React, { createRef, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { debounce } from 'lodash';
import { getMomomentLikeRecord, likeMoment, MomentType, unlikeMoment } from 'common/api/moment/momentLike';
import { Editor } from 'components/editor';
import { useOnClickOutSide } from 'common/hooks/useOnClickOutSide';

interface Props {
  moment: MomentExtra;
}
export const MomentCard: React.FC<Props> = (props: Props) => {
  const { moment } = props;
  // 是否喜欢该动态
  const [isLike, setIsLike] = useState(false);
  // 评论下拉框是否显示
  const [commentCollapseIsOpen, setCommentCollapseIsOpen] = useState(false);
  const editorRef = createRef<HTMLDivElement>();

  useOnClickOutSide<HTMLDivElement>(editorRef, () => setCommentCollapseIsOpen(false));

  useEffect(() => {
    moment.id &&
      getMomomentLikeRecord(moment.id, MomentType.MOMENT).then(res => {
        setIsLike(res?.data?.length > 0);
      });
  }, [moment.id]);

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
  }
  return (
    <div className={styles.momentCard}>
      <div className={styles.left}>
        <Avatar shape="square" src={moment.user_info.avatar} />
      </div>
      <div className={styles.main}>
        <div className={styles.name}>{moment?.user_info?.note || moment?.user_info?.name}</div>
        <div className={styles.content}>{moment.content}</div>
        <div className={styles.imgList}>
          {moment?.imgs_list?.map(img => (
            <div className={styles.imgItem} key={img}>
              <Avatar shape="square" src={img} />
            </div>
          ))}
        </div>
        <div className={styles.footer}>
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
          <Editor ref={editorRef} placeholder="请输入评论内容" isFunctionTabAtBottom />
        </Collapsible>
      </div>
    </div>
  );
};
