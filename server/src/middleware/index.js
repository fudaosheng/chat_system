const path = require('path');
const { middleware } = require('../app/config.json');

function registryMiddlewares() {
  console.log('registry middleware', middleware);
  middleware.forEach(middlewareName => {
      const middleware = require(__dirname + path.sep + middlewareName);
      this.use(middleware);
  })
}

module.exports = {
  registryMiddlewares,
};
