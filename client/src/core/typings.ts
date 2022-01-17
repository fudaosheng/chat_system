export enum MessageType {
  INIT = 'init', // 连接成功后，设置唯一标识专用
  TEXT = 'text', //存文本
  IMAGE = 'image', // 图片
  RICH_TEXT = 'richText', //富文本
}
// 聊天消息
export interface Message {
  userId: number; //这个消息的发送人
  time: Number; //时间戳，消息的发送时间
  message: string; //真正的消息
  type: MessageType;
}
// 聊天会话
export interface Chat {
  receiver: UserInfo; //消息接收人详细信息
  conversations: Array<Message>; //会话消息列表
}
export interface WebsocketState {
  userId: number;
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
