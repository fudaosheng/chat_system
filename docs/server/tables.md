# User表
```
CREATE TABLE users (
id int PRIMARY KEY auto_increment,
name varchar(50) NOT NULL,
password varchar(30) NOT NULL,
age int,
sex int,
phone_num VARCHAR(11) UNIQUE,
avatar VARCHAR(100)
);
```