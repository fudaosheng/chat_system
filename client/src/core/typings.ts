export enum MessageType {
  PING = 1, //心跳保活
  TEXT = 2, //存文本
  IMAGE = 3, // 图片
  RICH_TEXT = 4, //富文本
}
// 会话类型，chat单聊，chat_group群聊
export enum CHAT_TYPE {
  CHAT = 'chat',
  CHAT_GROUP = 'chatGroup'
}
// 聊天消息
export interface MessageStruct {
  fromId: number; //这个消息的发送人
  receiverId: number; //消息接收人的Id
  id: string;// 消息id
  chatId: number;// 会话id
  time: number; //时间戳，消息的发送时间
  message: string; //真正的消息体
  type: MessageType; // 消息类型
  chatType: CHAT_TYPE; //chat单聊，chatGroup群聊
}
// 聊天会话
export interface Chat {
  id: number; //会话id
  lastReadedMessageIndex: number;// 上次阅读的最后一条消息下标
  conversations: Array<MessageStruct>; //会话消息列表
  chatGroupInfo?: ChatGroup;// 群信息,单聊没有
  members: Array<UserInfo>; //成员信息，不包括自己
  type: CHAT_TYPE; // 会话类型
}
export interface WebsocketState {
  ws?: WebSocket;
  chatList: Array<Chat>; // 会话列表
}

export interface WebSocketExtend {
  _key?: string; // websocket唯一key
}

declare global {
  interface Window {
    ws?: WebSocket & WebSocketExtend;
  }
}
