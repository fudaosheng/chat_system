export enum STATUS_CODES {
  SUCCESS = 1,
  ERROR = 0,
}

export enum SEX {
  MAN = 1,
  WOMAN = 2,
}

// 好友申请工单状态
export enum APPLY_CONTACT_TICKET_STATUS {
  PENDING = 1,
  AGREE = 2,
  DISAGREE = 3,
}

// 群聊申请工单状态
export enum APPLY_CHAT_GROUP_TICKET_STATUS {
  PENDING = 1,
  AGREE = 2,
  DISAGREE = 3,
}

export const spinStyle = { height: '100%' };

// 群身份标识
export enum IDENTITY_LEVEL {
  OWNER = '1',
  MANAGER = '2',
  DEFAULT = '3'
}

export const identityLevelMap = new Map([
  ['1', '群主'],
  ['2', '管理员'],
  ['3', '普通成员']
])
