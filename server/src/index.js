const app = require('./app/index');
require('dotenv').config();
require('colors');
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`server start success on port：${PORT}`.green);
});
