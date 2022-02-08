const { WebSocketServer } = require('ws');
const { MessageType } = require('./typing');
require('colors');
const sendMessage = require('./sendMessage');
const chatGroupContactService = require('../../service/chatGroupContactService');
const { CHAT_TYPE } = require('../../constance');


const wss = new WebSocketServer({
  port: 8080,
  clientTracking: true, // 设置之后在wss.clients里能拿到所有已建立的连接
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});

// 监听连接创建成功
wss.on('connection', ws => {
  ws.on('message', data => {
    console.log(`wss received message: ${data}`.green);
    try {
      const message = JSON.parse(data) || {};
      const { type, chatType } = message;
      // 初始化，设置唯一标识
      if (type === MessageType.PING) {
        ws.key = message.message;
      }
      // 单聊消息
      if (chatType === CHAT_TYPE.CHAT) {
        sendMessage(wss.clients, message);
      }
      // 群聊消息
      if (chatType === CHAT_TYPE.CHAT_GROUP) {
        // 获取群成员的ID列表
        chatGroupContactService.getChatGroupMemberIds(message.chatId).then(result => {
          // 群成员用户id, type = Arrar<{id: number}>
          const memberIds = result[0];
          Array.isArray(memberIds) &&
            memberIds.forEach(({ id }) => {
              // 批量给群成员推送消息
              id !== message.fromId && sendMessage(wss.clients, { ...message, receiverId: id });
            });
        });
      }
    } catch (err) {
      console.log('receive error', err);
    }
  });

  ws.send(JSON.stringify('websocket nection success'));
});

// 监听连接关闭
wss.on('close', ws => {
  console.log('websocket connection closed');
});

module.exports = wss;
