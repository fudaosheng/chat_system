import React, { useContext } from 'react';
import { Avatar, Button, Popover, Upload } from '@douyinfe/semi-ui';
import { IconEdit, IconCamera } from '@douyinfe/semi-icons';
import { GlobalContext } from 'common/store';
import styles from './index.module.scss';

const hoverMask = (
  <div className={styles.iconCamera}>
    <IconCamera />
  </div>
);

export const UserInfoCard: React.FC = () => {
  const {
    state: { userInfo },
  } = useContext(GlobalContext);

  const renderUserInfoCard = () => {
    return (
      <div className={styles.userInfoCard}>
        <div className={styles.top}>
          <div className={styles.avatar}>
            <Upload
              className="avatar-upload"
              // action={api}
              // onSuccess={onSuccess}
              // accept={imageOnly}
              showUploadList={false}
              // onError={() => Toast.error('上传失败')}
            >
              <Avatar size="large" hoverMask={hoverMask} />
            </Upload>
          </div>
          <div className={styles.main}>
            <div className={styles.name}>{userInfo.name || ''}</div>
            <div className={styles.bio}>
              <span>输入个性签名</span>
              <Button icon={<IconEdit size="small" />} type="tertiary" theme="borderless" />
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Popover trigger="click" content={renderUserInfoCard()} position="bottomRight">
        <Avatar>{userInfo.name.substring(0, 2)}</Avatar>
      </Popover>
    </div>
  );
};
