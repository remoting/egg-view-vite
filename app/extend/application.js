const { createServer, loadConfigFromFile, mergeConfig } = require('vite')
const VITECONFIG = Symbol('Application#viteconfig')
const VITE = Symbol('Application#vite')
module.exports = {
    async getViteConfig() {
        if (!this[VITECONFIG]) {
            this[VITECONFIG] = await loadConfigFromFile({}, "vite.config.js")
        }
        return this[VITECONFIG]
    },
    async getVite() {
        if (!this[VITE]) {
            const viteConfig = await this.getViteConfig()
            this[VITE] = await createServer(
                mergeConfig(viteConfig, {
                    mode: 'development',
                    server: {
                        middlewareMode: 'ssr',
                        watch: {
                            usePolling: true,
                            interval: 100
                        }
                    },
                })
            )
        }
        return this[VITE]
    }
}