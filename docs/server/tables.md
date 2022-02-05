# 图片表
用于存放所有静态图片，永久存放
```
CREATE TABLE `imgs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(256) NOT NULL,
  `mimetype` varchar(50) DEFAULT NULL,
  `size` int DEFAULT NULL,
  `encoding` varchar(50) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `filename` (`filename`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3
```

# 用户图片表
每张图片都需要与user对应
```
CREATE TABLE `user_imgs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(256) NOT NULL,
  `mimetype` varchar(50) DEFAULT NULL,
  `size` int DEFAULT NULL,
  `encoding` varchar(50) DEFAULT NULL,
  `user_id` int NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `filename` (`filename`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_imgs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3
```

# User表
```
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `password` varchar(200) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `sex` int DEFAULT NULL,
  `phone_num` varchar(11) DEFAULT NULL,
  `avatar` varchar(100) DEFAULT NULL,
  `bio` varchar(50) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_num` (`phone_num`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3
```

# 申请好友工单表
```
CREATE TABLE `apply_contact_ticket` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_user_id` int NOT NULL,
  `target_user_id` int NOT NULL,
  `status` int DEFAULT '1',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `message` varchar(100) DEFAULT NULL,
  `group_id` int NOT NULL,
  `note` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `applicant_user_id` (`applicant_user_id`),
  KEY `target_user_id` (`target_user_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `apply_contact_ticket_ibfk_1` FOREIGN KEY (`applicant_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `apply_contact_ticket_ibfk_2` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `apply_contact_ticket_ibfk_3` FOREIGN KEY (`group_id`) REFERENCES `contact_group` (`id`),
  CONSTRAINT `apply_contact_ticket_ibfk_4` FOREIGN KEY (`group_id`) REFERENCES `contact_group` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3
```

# 联系人分组表
```
CREATE TABLE `contact_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `user_id` int NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `contact_group_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3
```

# 联系人表
```
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  `contact_id` int NOT NULL,
  `note` varchar(20) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`),
  KEY `contact_id` (`contact_id`),
  CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `contacts_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `contact_group` (`id`),
  CONSTRAINT `contacts_ibfk_3` FOREIGN KEY (`contact_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3
```

# 离线消息列表
```
CREATE TABLE `offline_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fromId` int NOT NULL,
  `receiverId` int NOT NULL,
  `chatId` int NOT NULL,
  `message` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `type` enum('1','2','3','4') DEFAULT NULL,
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fromId` (`fromId`),
  KEY `receiverId` (`receiverId`),
  CONSTRAINT `offline_messages_ibfk_1` FOREIGN KEY (`fromId`) REFERENCES `users` (`id`),
  CONSTRAINT `offline_messages_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3
```

// 群组表
CREATE TABLE `chat_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `announcement` varchar(400) DEFAULT NULL,
  `avatar` varchar(100) DEFAULT NULL,
  `owner_id` int NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `chat_groups_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3

// 群申请工单表
CREATE TABLE `chat_group_apply_tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_user_id` int NOT NULL,
  `group_id` int NOT NULL,
  `target_user_id` int NOT NULL,
  `status` enum('1','2','3') DEFAULT '1',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `operator_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `applicant_user_id` (`applicant_user_id`),
  KEY `group_id` (`group_id`),
  KEY `target_user_id` (`target_user_id`),
  KEY `operator_id` (`operator_id`),
  CONSTRAINT `chat_group_apply_tickets_ibfk_1` FOREIGN KEY (`applicant_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_group_apply_tickets_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `chat_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_group_apply_tickets_ibfk_3` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_group_apply_tickets_ibfk_4` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3

// 群成员表
CREATE TABLE `chat_group_contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `user_id` int NOT NULL,
  `identity` enum('1','2','3') DEFAULT '3',
  `note` varchar(30) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `chat_group_contacts_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `chat_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_group_contacts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3