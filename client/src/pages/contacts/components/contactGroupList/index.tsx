import React from 'react';
import { Tree } from '@douyinfe/semi-ui';
import styles from './index.module.scss';

interface Props {
  data: Array<DetailContactGroupInfoExtra>;
}

export const ContactGroupList: React.FC<Props> = (props: Props) => {
  const { data } = props;
  return (
    <>
      <Tree treeData={data} />
    </>
  );
};
