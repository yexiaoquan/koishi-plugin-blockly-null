function fetchDataFromUrl(url) {
    const http = require('http');
    const fs = require('fs');
    const urlModule = require('url');
    return new Promise((resolve, reject) => {
        const parsedUrl = urlModule.parse(url);
        if (parsedUrl.protocol.startsWith('http')) {
            const protocol = parsedUrl.protocol === 'https:' ? require('https') : require('http');
            protocol.get(url, (res) => {
                const data = [];
                res.on('data', (chunk) => {
                    data.push(chunk);
                });
                res.on('end', () => {
                    resolve(Buffer.concat(data));
                }).on('error', (err) => {
                    console.error(err.message);
                    reject(err);
                });
            });
        } else if (parsedUrl.protocol === 'file:') {
            fs.readFile(parsedUrl.path, (err, data) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } else {
            reject(new Error(`Unsupported protocol: ${parsedUrl.protocol}`));
        }
    });
}
