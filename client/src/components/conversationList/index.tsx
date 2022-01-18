import { MessageStruct } from 'core/typings';
import React from 'react';
interface Props {
  userInfo: UserInfo;
  receiverList?: Array<UserInfo>; // 消息接收者信息列表
  conversationList?: Array<MessageStruct>;
}
export const ConversationList: React.FC<Props> = (props: Props) => {
  const { userInfo, receiverList, conversationList = [] } = props;
  return (
    <ul>
      {conversationList.map(conversation => (
        <li key={conversation.id}>
          <pre>{conversation.message}</pre>
        </li>
      ))}
    </ul>
  );
};
