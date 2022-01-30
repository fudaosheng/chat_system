import { Upload, Avatar, Toast } from '@douyinfe/semi-ui';
import { IconCamera } from '@douyinfe/semi-icons';
import React from 'react';
import styles from './index.module.scss';
import { customRequestArgs, UploadProps } from '@douyinfe/semi-ui/upload';
import { AvatarProps } from '@douyinfe/semi-ui/avatar';
import { uploadImg } from 'common/api/file';

export const imageOnly = 'image/*';

export const hoverMask = (
  <div className={styles.iconCamera}>
    <IconCamera />
  </div>
);

interface Props extends Omit<UploadProps, 'onChange'> {
  avatarProps?: AvatarProps;
  value: string;
  children?: React.ReactChild;
  onChange?: (value: string) => void;
  onUploadChange?: UploadProps['onChange'];
}
export const UploadAvatar: React.FC<Props> = (props: Props) => {
  const { onUploadChange, avatarProps = {}, value, children = null, onChange, ...restProps } = props;
  const handleUploadImg = async (params: customRequestArgs) => {
    try {
      const { data } = await uploadImg(params.fileInstance);
      if (data.url) {
        onChange && onChange(data.url);
      }
    } finally {
    }
  };
  return (
    <Upload
      className="avatar-upload"
      name="img"
      accept={imageOnly}
      showUploadList={false}
      customRequest={handleUploadImg}
      onError={() => Toast.error('上传失败')}
      onChange={onUploadChange}
      {...restProps}>
      <Avatar src={value} size="large" hoverMask={hoverMask} {...avatarProps}>
        {children}
      </Avatar>
    </Upload>
  );
};
