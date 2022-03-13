const path = require('path')
const fs = require('fs')
const resolve = (base, p) => path.resolve(base, p)

async function html(ctx, next) {
    const isProd = (ctx.app.config.viteVue.dev != true)
    const vite = await ctx.app.getVite(ctx)
    const indexProd = isProd ? fs.readFileSync(resolve(ctx.app.baseDir, 'dist/client/index.html'), 'utf-8') : ''
    const manifest = isProd ? require(ctx.app.baseDir + '/dist/client/ssr-manifest.json') : {}
    try {
        const url = ctx.originalUrl
        let template, render
        if (!isProd) {
            // always read fresh template in dev
            template = fs.readFileSync(resolve(ctx.app.baseDir, 'index.html'), 'utf-8')
            template = await vite.transformIndexHtml(url, template)
            render = (await vite.ssrLoadModule('/src/entry-server.js')).render
        } else {
            template = indexProd
            render = require(ctx.app.baseDir + '/dist/server/entry-server.js').render
        }

        const [appHtml, preloadLinks] = await render(url, manifest)

        const html = template
            .replace(`<!--preload-links-->`, preloadLinks)
            .replace(`<!--app-html-->`, appHtml)

        ctx.type = 'text/html'
        ctx.body = html
        //res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
        vite && vite.ssrFixStacktrace(e)
        console.log(e.stack)
    }
}

module.exports = html