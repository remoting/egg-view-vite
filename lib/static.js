const fs = require('fs');
const path = require('path');
function extname(url) {
    let ext = url.split('.');
    ext = ext[ext.length - 1];
    return ext.toLowerCase();
}
function getFilePath(url) {
    const static = './dist/client';
    const filePath = url;
    return `${static}${filePath}`;
}

function getFile(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(url), (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    })
}
const mimetypes = {
    'css': 'text/css',
    'less': 'text/css',
    'gif': 'image/gif',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript',
    'json': 'application/json',
    'pdf': 'application/pdf',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'swf': 'application/x-shockwave-flash',
    'tiff': 'image/tiff',
    'txt': 'text/plain',
    'wav': 'audio/x-wav',
    'wma': 'audio/x-ms-wma',
    'wmv': 'video/x-ms-wmv',
    'xml': 'text/xml'
}

async function getStatic(ctx) {
    try {
        const ext = extname(ctx.url);
        const mimetype = mimetypes[ext];
        const filePath = getFilePath(ctx.url);
        let file = await getFile(filePath);
        return { code: 0, file, mimetype };
    } catch (err) {
        return { code: -1, err }
    }
}

module.exports = getStatic