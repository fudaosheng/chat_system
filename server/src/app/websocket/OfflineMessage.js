/**
 * 离线消息类
 * @author fudaosheng
 */

class OfflineMessage {
  fromId; //这个消息的发送人
  receiverId; //消息接收人的Id
  chatId;
  time; //时间戳，消息的发送时间
  message; //真正的消息体
  type;

  constructor(chatId, fromId, receiverId, message, type) {
    this.fromId = fromId;
    this.receiverId = receiverId;
    this.type = type;
    this.message = message;
    this.time = new Date().getTime();
    this.chatId = chatId;
  }
}

module.exports = OfflineMessage;
