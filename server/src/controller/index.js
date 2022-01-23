const fs = require('fs');
const { sep } = require('path');

function registryControllers() {
  const paths = fs.readdirSync(__dirname);
  console.log('registry controllers: ', paths);
  this.context.controllers = {};
  paths.forEach(path => {
    if (path === 'index.js') {
      return;
    }
    const controller = require(__dirname + sep + path);
    this.context.controllers[path] = controller;
  });
}

module.exports = {
  registryControllers,
};
