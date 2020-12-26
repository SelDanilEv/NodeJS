const http = require('http');
const fs = require('fs');

function loadHTML(request, response, source) {
    new Promise((resolve, reject) => {
        try {
            let html = fs.readFileSync(source);
            resolve(html);
        } catch (err) {
            reject(err);
        }
    }).then(html => {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }).catch(err =>
        console.log(err));
}

let lastSendObj = '';

let DO_GET = (req, res) => {
    switch (req.url.split('?')[0]) {
        case '/api/getLastSend':
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(lastSendObj.toString());
            break;
        default:
            loadHTML(req, res, 'index.html');
            break;
    }
};

let DO_POST = (req, res) => {
    switch (req.url.split('?')[0]) {
        case '/send':
            let reqbody;
            res.writeHead(200, {'Content-Type': 'json/application; charset=utf-8'});
            req.on('data', chunk => {
                reqbody = chunk.toString();
                reqbody = JSON.parse(reqbody);
            });
            req.on('end', async () => {
                lastSendObj = JSON.stringify(reqbody);
                console.log(lastSendObj);
                res.end(lastSendObj);
            });
            break;
    }
};

let HTTP405 = (req, res) => {
    res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(`Error" : "${req.method}: ${req.url}, HTTP status 405"`);
}

let http_handler = (req, res) => {
    switch (req.method) {
        case 'GET':
            DO_GET(req, res);
            break;
        case 'POST':
            DO_POST(req, res);
            break;
        default:
            HTTP405(req, res);
            break;
    }
};


const server = http.createServer().listen(5000, () => {
    console.log('Server running at http://localhost:5000/');
})
    .on('request', http_handler);
