import React, { useCallback, useContext } from 'react';
import { Avatar, Button, Popover, Upload, Toast } from '@douyinfe/semi-ui';
import { customRequestArgs } from '@douyinfe/semi-ui/upload';
import { IconEdit, IconCamera } from '@douyinfe/semi-icons';
import { GlobalContext } from 'common/store';
import styles from './index.module.scss';
import { request } from 'common/api';
import { uploadImg } from 'common/api/file';
import { setUserAvatar } from 'common/api/user';
import { GlobalAction } from 'common/store/action';

const imageOnly = 'image/*';

const hoverMask = (
  <div className={styles.iconCamera}>
    <IconCamera />
  </div>
);

export const UserInfoCard: React.FC = () => {
  const {
    state: { userInfo },
    dispatch
  } = useContext(GlobalContext);
  

  const handleUploadImg = useCallback(async (params: customRequestArgs) =>{
    try {
      const { data } = await uploadImg(params.fileInstance);
      if(data.url) {
        dispatch(GlobalAction.setUserInfo({ ...userInfo, avatar: data.url }));
        // 发起请求异步更新数据库里图片链接
        setUserAvatar(data.url);
      }
      
    } finally {

    }
  }, [userInfo]);

  const renderUserInfoCard = () => {
    return (
      <div className={styles.userInfoCard}>
        <div className={styles.top}>
          <div className={styles.avatar}>
            <Upload
              className="avatar-upload"
              action={''}
              name='img'
              accept={imageOnly}
              showUploadList={false}
              customRequest={handleUploadImg}
              onError={() => Toast.error('上传失败')}
            >
              <Avatar src={userInfo.avatar} size="large" hoverMask={hoverMask} />
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
        <Avatar src={userInfo.avatar}>{userInfo.name.substring(0, 2)}</Avatar>
      </Popover>
    </div>
  );
};
