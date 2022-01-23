// 消息类型
const MessageType = {
  PING: 'ping', //心跳保活
  TEXT: 'text', // 存文本
  IMAGE: 'image', // 图片
  RICH_TEXT: 'richText', // 富文本
};

module.exports = {
  MessageType,
};
