const { WebSocketServer } = require('ws');
const { MessageType } = require('./typing');
const offlineMessageService = require('../../service/offlineMessageService');
const CHAT_TYPE = {
  CHAT: 'chat', // 单聊
  CHAT_GROUP: 'chatGroup', // 群聊
};

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
    console.log('received: %s', data);
    try {
      const messageData = JSON.parse(data) || {};
      const { fromId, receiverId, id, time, message, type, chatType } = messageData;
      // 初始化，设置唯一标识
      if (type === MessageType.PING) {
        ws.key = message;
      } else {
        // 消息接收者的ws连接
        let receiverClient;

        if (wss.clients) {
          wss.clients.forEach(client => {
            if (client.key && Number(client.key) === Number(receiverId)) {
              receiverClient = client;
            }
          });
        }
        if (chatType === CHAT_TYPE.CHAT) {
          // 用户在线
          if (receiverClient) {
            // 将A的消息转发给B
            receiverClient.send(JSON.stringify(messageData));
          } else {
            // 用户离线
            console.log('receiver离线');
            offlineMessageService.appendOfflineMessage(messageData);
          }
        }
        if(chatType === CHAT_TYPE.CHAT_GROUP) {
          console.log('群聊会话');
        }
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
