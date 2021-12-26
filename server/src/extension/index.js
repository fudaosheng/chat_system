const fs = require('fs');
const _path = require('path');

function registryExtensions() {
    const paths = fs.readdirSync(__dirname);
    console.log('registry extensions', paths);
    paths.forEach(path => {
        if(path === 'index.js') {
            return;
        }
        const extension = require(`.${_path.sep + path}`);
        this.context[path] = extension;
    })
}

module.exports = {
    registryExtensions
}