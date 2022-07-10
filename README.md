# chat_system|即时聊天系统

## 前言
本系统代码均为个人原创，若在网上发表请指明出处。本系统开源目的只是为了供技术爱好者学习、交流。如果你觉得本项目不错，麻烦点个:star:（star），这也会激励我持续维护本项目。

## 系统技术栈：
***前端主要技术栈：*** React、TypeScript、WebSocket API、semi-ui、axios、immer、sass等。

***后端主要技术栈：*** Node.js、Koa、mysql2、ws、koa-router、@koa/multer、jsonwebtoken、koa-bodyparser等。

## 系统主要功能
1. ***注册登陆模块：*** 用户注册及登陆，token签发、认证等。
2. ***个人信息模块：*** 个人信息的增删查改等。
3. ***联系人管理模：*** 添加好友、查看添加好友记录、修改好友备注、查看好友信息等。
4. ***群聊管理模块：*** 实现入群申请、邀请好友入群、入群申请处理、修改群公告、查看群聊信息等。
5. ***聊天模块：*** 实现单聊/群聊，支持文字、图片、emoji表情。
6. ***朋友圈模块：*** 支持发表动态，查看好友动态，对动态进行点赞、评论。

## 系统功能预览
<a href="https://www.bilibili.com/video/BV1z94y1X7J4?spm_id_from=333.999.0.0&vd_source=9beb9d610c807fa3b7ff85522c0e595a" target="_blank">系统视频演示地址</a>

聊天|发送emojo|个人信息
---|:--:|---:
![聊天](./docs/client/conversation.png)|![emoji](./docs/client/emoji.png)|![个人信息卡片](./docs/client/profileInfo.png)

添加联系人|申请好友表单|添加好友记录
---|:--:|---:
![添加联系人](./docs/client/contact.png)|![好友申请信息](./docs/client/apply.png)|![添加好友记录](./docs/client/contact_tickets.png)

入群记录|联系人信息|发表动态
---|:--:|---:
![入群记录](./docs/client/group_tickets.png)|![联系人信息](./docs/client/contactInfo.png)|![发表动态](./docs/client/release_moment.png)

动态列表|动态评论|动态点赞
---|:--:|---:
![入群记录](./docs/client/moments.png)|![动态评论](./docs/client/comment_moment.png)|![动态点赞](./docs/client/like_moment.png)

## 如何启动项目
1. ***创建数据库：*** 
`create database chat_system;`
2. ***连接数据库：***
`use chat_system`;
3. ***创建数据表：***
创建本系统各表的SQL详见:point_right:[各表SQL语句](./docs/server/tables.md),copy到终端中执行即可。
4. ***创建系统配置文件：***
进入到本系统目录执行`touch server/.env`
5. ***配置系统配置文件：***
将如下代码copy到server/.env中
```
# 服务端口号
SERVER_PORT=8000 
# 系统图片保存路径，绝对路径。
IMG_PATH=/Users/chat_system/test
# mysql host配置
MYSQL_LOCALHOST=localhost 
# mysql 端口配置
MYSQL_PROT=3306
# mysql 连接身份
MYSQL_USER=root
# mysql 连接密码，在这里配置上自己mysql的密码
MYSQL_PASSWORD=password
# 数据库
MYSQL_DATABASE=chat_system
# 连接池配置
MYSQL_CONNECTION_LIMIT=10
MYSQL_QUEUE_LIMIT=0
```
6. ***在系统根目录下安装依赖：***
`npm run post-install`
7. ***启动项目：***
`npm start`
至此，本项目已启动成功，你可以开始体验本项目，或对本项目进行二次开发。

## 关于本项目
### 项目更新
本人会在工作/学习之余持续对本项目进行维护、迭代
### 如果遇到BUG怎么办？
由于个人精力有限，所以本人只对项目中的核心case进行过较详细测试，如果你在本项目遇到任何问题，欢迎大家提Issue，或者直接修复后给我提Merge Request。
### 共同开发
欢迎更多热爱技术、热爱开源的优秀小伙伴一起加入本项目，也欢迎大家给本项目提Merge Request。
### 提交规范
在提Issues时请尽可能简洁、清楚的描述问题，和如何进行场景复现。这能使开发者快速定位、解决问题。
### 技术交流群
欢迎大家入群（QQ）交流。

![QR_code](./docs/OR_code.jpg)