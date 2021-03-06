const fs = require('fs');
const _path = require('path');
require('colors');

function registryRoutes() {
    const paths = fs.readdirSync(__dirname);
    console.log('registry router: ', paths);
    paths.forEach(path => {
        if(path === 'index.js') {
            return;
        }
        const route = require(`.${_path.sep}` + path);
        route.routes && this.use(route.routes());
        route.allowedMethods && this.use(route.allowedMethods());
    })
}

module.exports = {
    registryRoutes
}