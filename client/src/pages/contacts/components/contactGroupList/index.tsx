import React, { ReactNode } from 'react';
import { Tree } from '@douyinfe/semi-ui';
import { useHistory } from 'react-router-dom';
import styles from './index.module.scss';
import { UserCard } from 'components/userCard';

interface Props {
  data: Array<DetailContactGroupInfoExtra>;
  onChange?: (userId: string) => void;
}

export const ContactGroupList: React.FC<Props> = (props: Props) => {
  const { data, onChange } = props;
  const history = useHistory();

  const renderLabel = (label: ReactNode, data: any) => {
    const { type } = data;
    if(type === 'group') {
      return label
    }
    return (
      <UserCard userInfo={data} name={data?.note} onClick={() => onChange && onChange(data.id)} />
    );
  }
  return (
    <>
      <Tree className={styles.contactTree} treeData={data} renderLabel={renderLabel} />
    </>
  );
};
