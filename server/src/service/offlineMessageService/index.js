/**
 * 离线消息service
 * @author fudaosheng
 */
const OfflineMessage = require('../../app/websocket/OfflineMessage');
const { TABLE_NAMES } = require('../../constance/tables');
const dbService = require('../dbService');

class OfflineMessageService {
    /**
     * 
     * @param {*} message type is OfflineMessage
     */
    async appendOfflineMessage(message) {
        if(message.id) {
            delete message.id;
        }
        if(message.time) {
            delete message.time;
        }
        console.log(message);
        return await dbService.insert(message, TABLE_NAMES.OFFLINE_MESSAGES);
    }
}

module.exports = new OfflineMessageService();