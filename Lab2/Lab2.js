'use strict'

let http = require('http');
let fs = require('fs');

let server = http.createServer((require, response) => {
    let html;
    let source;
    let isText = true;

    switch (require.url) {
        case "/png":
            const path = './../img/bk.png';
            let png = null;
            fs.stat(path, (err, stat) => {
                if (err) {
                    console.log('error', err);
                } else {
                    png = fs.readFileSync(path);
                    response.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': stat.size});
                    response.end(png, 'binary');
                }
            });
            isText = false;
            break;
        case "/xmlhttprequest":
            source = 'xmlhttprequest.html';
            break;
        case "/jquery":
            source = 'jQuery.html';
            break;
        case "/fetch":
            source = 'fetch.html';
            break;
        case "/api/name":
            source = 'info.txt';
            break;
        case "/html":
        default:
            source = 'index.html';
            break;
    }
    if (isText) {
        html = fs.readFileSync(source);
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }

});

server.listen(5000);

console.log('Server running at http://localhost:5000/');
