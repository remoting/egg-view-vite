'use strict';
const html = require('./lib/html.js')
module.exports = app => {
    /*
    console.log("xxx", app.config.viteVue)
    const staticIndex = app.config.coreMiddleware.indexOf('static')
    console.log(app.config.coreMiddleware)
    app.config.coreMiddleware.splice(staticIndex, 1)
    console.log(app.config.coreMiddleware)
    */
    app.config.coreMiddleware.push('vite')
    app.router.get('*', html);
};
