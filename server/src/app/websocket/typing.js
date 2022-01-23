// 消息类型
const MessageType = {
  PING: 1, //心跳保活
  TEXT: 2, // 存文本
  IMAGE: 3, // 图片
  RICH_TEXT: 4, // 富文本
};

module.exports = {
  MessageType,
};
