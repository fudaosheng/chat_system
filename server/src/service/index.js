const fs = require('fs');
const _path = require('path');

function registryServices() {
    // 想context上注册service实例
    this.context.service = {};
    const paths = fs.readdirSync(__dirname);
    console.log('registry services：', paths);
    paths.forEach(path => {
        if(path === 'index.js') {
            return;
        }
        this.context.service[path] = require(`.${_path.sep + path}`);
    })
}

module.exports = {
    registryServices
}