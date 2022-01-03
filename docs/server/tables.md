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
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `filename` (`filename`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `imgs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3
```