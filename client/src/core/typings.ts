export enum MessageType {
  PING = 1, //心跳保活
  TEXT = 2, //存文本
  IMAGE = 3, // 图片
  RICH_TEXT = 4, //富文本
}
// 聊天消息
export interface MessageStruct {
  fromId: number; //这个消息的发送人
  receiverId: number; //消息接收人的Id
  id: string;// 消息id
  chatId: number;// 会话id
  time: number; //时间戳，消息的发送时间
  message: string; //真正的消息体
  type: MessageType;
}
// 聊天会话
export interface Chat {
  id: number; //会话id
  receiver: UserInfo; //消息接收人详细信息
  conversations: Array<MessageStruct>; //会话消息列表
}
export interface WebsocketState {
  ws?: WebSocket;
  chatList: Array<Chat>;
}

export interface WebSocketExtend {
  _key?: string; // websocket唯一key
}

declare global {
  interface Window {
    ws?: WebSocket & WebSocketExtend;
  }
}
