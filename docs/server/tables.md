# 图片表
用于存放所有静态图片
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_num` (`phone_num`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3
```

# 申请好友表
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
  PRIMARY KEY (`id`),
  KEY `applicant_user_id` (`applicant_user_id`),
  KEY `target_user_id` (`target_user_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `apply_contact_ticket_ibfk_1` FOREIGN KEY (`applicant_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `apply_contact_ticket_ibfk_2` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `apply_contact_ticket_ibfk_3` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`),
  CONSTRAINT `apply_contact_ticket_ibfk_4` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3
```

# 联系人分组表
```
CREATE TABLE group (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name varchar(30) NOT NULL, --分组名称
  user_id INT NOT NULL, --分组属于谁
  contact_ids TEXT, -- 联系人
  create_time timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  update_time timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```