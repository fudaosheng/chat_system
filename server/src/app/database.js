const mysql = require('mysql2');

const {
  MYSQL_LOCALHOST,
  MYSQL_PROT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_CONNECTION_LIMIT,
  MYSQL_QUEUE_LIMIT,
} = require('./env');

const connectionPoolConfig = {
  host: MYSQL_LOCALHOST,
  port: MYSQL_PROT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: MYSQL_CONNECTION_LIMIT,
  queueLimit: MYSQL_QUEUE_LIMIT,
};

console.log('mysql.createPool config：', connectionPoolConfig);
const connections = mysql.createPool(connectionPoolConfig);

connections.getConnection(err => {
  if (err) {
    console.log(`database connection error：${err}`);
  } else {
    // console.log(MYSQL_DATABASE);
    console.log('database connection success');
  }
});

module.exports = connections.promise();
