// 消息类型
const MessageType = {
  INIT: 'init', // 连接成功后，设置唯一标识专用
  TEXT: 'text', // 存文本
  IMAGE: 'image', // 图片
  RICH_TEXT: 'richText', // 富文本
};

module.exports = {
  MessageType,
};
