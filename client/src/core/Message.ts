import { MessageType, MessageStruct, CHAT_TYPE } from './typings';
import { nanoid } from 'nanoid';
/**
 * 消息类
 * @author fudaosheng
 */

export class Message implements MessageStruct {
  fromId: number; //这个消息的发送人
  receiverId: number; //消息接收人的Id
  id: string; // 消息id
  chatId: number;
  time: number; //时间戳，消息的发送时间
  message: string; //真正的消息体
  type: MessageType;
  chatType: CHAT_TYPE;

  constructor(chatId: number, fromId: number, receiverId: number, message: string, type: MessageType, chatType: CHAT_TYPE) {
    this.fromId = fromId;
    this.receiverId = receiverId;
    this.type = type;
    this.message = message;
    this.id = nanoid();
    this.time = new Date().getTime();
    this.chatId = chatId;
    this.chatType = chatType;
  }
}
