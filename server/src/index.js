const app = require('./app/index');
require('dotenv').config();
require('colors');

const { SERVER_PORT } = process.env;

app.listen(SERVER_PORT, () => {
  console.log(`server start success on port：${SERVER_PORT}`.green);
});

process.once('SIGUSR2', function () {
  console.log(`pid: ${process.pid}`.red);
  process.kill(process.pid, 'SIGUSR2');
});

// process.on('SIGINT', function () {
//   console.log(`SIGINT, pid: ${process.pid}`.red);
//   process.kill(process.pid, 'SIGINT');
// });
