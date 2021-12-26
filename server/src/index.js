const app = require('./app/index');
require('dotenv').config();
require('colors');
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`server start success on port：${PORT}`.green);
});

process.once('SIGUSR2', function () {
  console.log(`pid: ${process.pid}`.red);
  process.kill(process.pid, 'SIGUSR2');
});
