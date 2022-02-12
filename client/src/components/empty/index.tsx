import { Empty } from '@douyinfe/semi-ui';
import { IllustrationIdle, IllustrationNoContent, IllustrationNoResult } from '@douyinfe/semi-illustrations';

export const EmptyContent = <Empty image={<IllustrationIdle style={{ width: 200, height: 200 }} />} />;

export const NoContacts = (
  <Empty image={<IllustrationNoContent style={{ width: 150, height: 150 }} />} description={'暂无联系人，请添加'} />
);

export const NoResult = (<Empty
  image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
  description={'搜索无结果'}
  style={{ width: 200, height: 200 }}
/>);
