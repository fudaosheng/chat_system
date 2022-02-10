import { Avatar } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import { IconLikeThumb, IconDislikeThumb, IconComment } from '@douyinfe/semi-icons';
import { dateTimeFormat, formatDate } from 'common/utils';
import React, { useState } from 'react';
import styles from './index.module.scss';
import { debounce } from 'lodash';
import { likeMoment, MomentType, unlikeMoment } from 'common/api/moment/momentLike';

interface Props {
  moment: MomentExtra;
}
export const MomentCard: React.FC<Props> = (props: Props) => {
  const { moment } = props;
  const [isLike, setIsLike] = useState(false);

  // 点赞或取消点赞
  const handleLikeOrUnlikeMoment = debounce(() => {
    isLike ? unlikeMoment(moment.id, MomentType.MOMENT) : likeMoment(moment.id, MomentType.MOMENT);
    setIsLike(!isLike);
  }, 1000, { leading: true });
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
                [styles.like]: isLike,
              })}
              size="large"
              onClick={handleLikeOrUnlikeMoment}
            />
            {/* <IconDislikeThumb size="large" /> */}
            <IconComment size="large" />
          </div>
        </div>
      </div>
    </div>
  );
};
