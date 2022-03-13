'use strict';

const koaConnect = require('../../lib/connect')
const getStatic = require('../../lib/static')

module.exports = (options, app) => {
    return async (ctx, next) => {
        const isProd = (app.config.viteVue.dev != true)
        if (!isProd) {
            const vite = await ctx.app.getVite(ctx)
            if (vite && vite.middlewares) {
                // 因为vite的中间件是基于express，而egg是基于koa，因此要转换
                await koaConnect(vite.middlewares)(ctx, next)
            } else {
                app.logger.error("vite 创建失败");
                await next();
            }
        } else {
            let obj = await getStatic(ctx);
            if (obj.code === -1) {
                await next()
            } else {
                if (obj.mimetype) ctx.type = obj.mimetype;
                if (obj.mimetype && obj.mimetype.startsWith('image/')) {
                    ctx.res.writeHead(200);
                    ctx.res.write(obj.file, 'binary');
                    ctx.res.end();
                } else {
                    ctx.body = obj.file.toString();
                }
            }
        }
    }
};
