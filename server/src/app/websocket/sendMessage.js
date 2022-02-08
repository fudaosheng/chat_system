const offlineMessageService = require('../../service/offlineMessageService');

const sendMessage = (clients, message) => {
  const { receiverId } = message;
  // 消息接收者的ws连接
  let receiverClient;
  if (clients) {
    clients.forEach(client => {
      if (client.key && Number(client.key) === Number(receiverId)) {
        receiverClient = client;
      }
    });
    // 用户在线
    if (receiverClient) {
      // 将A的消息转发给B
      receiverClient.send(JSON.stringify(message));
    } else {
      // 用户离线
      offlineMessageService.appendOfflineMessage(message);
    }
  }
};

module.exports = sendMessage;
