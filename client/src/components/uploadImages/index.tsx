import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import { UploadProps } from '@douyinfe/semi-ui/upload';
import styles from './index.module.scss';

interface Props extends UploadProps {
  className?: string;
}
export const UploadImages: React.FC<Props> = (props: Props) => {
  const { className, ...restProps } = props;
  return (
    <Upload className={`${styles.uploadWrapper} ${className}`} listType="picture" accept="image/*" multiple {...restProps}>
      <IconPlus size="extra-large" />
    </Upload>
  );
};
