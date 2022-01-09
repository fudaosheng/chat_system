import { ContactGroupStruct } from 'pages/contacts';
import React from 'react';
import { Tree } from '@douyinfe/semi-ui';
import styles from './index.module.scss';

interface Props {
  data: Array<ContactGroupStruct>;
}

export const ContactGroupList: React.FC<Props> = (props: Props) => {
  const { data } = props;
  return (
    <>
      <Tree treeData={data} />
    </>
  );
};
