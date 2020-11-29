const Db = require('./queries');
const fs = require('fs');
let url = require("url");
const http = require('http');
const DB = new Db();

const PORT = 3000;
const HOST = 'localhost';

let HTTP404 = (req, res) => {
    console.log(`${req.method}: ${req.url}, HTTP status 404`);
    res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(`"error" : "${req.method}: ${req.url}, HTTP status 404"`);
}

let HTTP405 = (req, res) => {
    console.log(`${req.method}: ${req.url}, HTTP status 405`);
    res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(`Error" : "${req.method}: ${req.url}, HTTP status 405"`);
}

let reqestHandler = (req, res) => {
    switch (req.method) {
        case 'GET':
            DO_GET(req, res);
            break;
        case 'POST':
            DO_POST(req, res);
            break;
        case 'PUT':
            DO_PUT(req, res);
            break;
        case 'DELETE':
            DO_DELETE(req, res);
            break;
        default:
            HTTP405(req, res);
            break;
    }
};

let DO_GET = (req, res) => {
    let pathname = url.parse(req.url, true).pathname;
    switch ('/' + GET_PART_FROM_URL(pathname, 1)) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(fs.readFileSync('./index.html'));
            break;
        case '/api':
            let table = GET_PART_FROM_URL(pathname, 2);
            DB.Get(table).then(records => {
                res.end(JSON.stringify(records.recordset));
            }).catch(error => {
                res.statusCode = 400;
                res.end(JSON.stringify({error: String(error)}));
            });
            break;
        default:
            HTTP404(req, res);
            break;
    }
};

let DO_POST = (req, res) => {
    let pathname = url.parse(req.url, true).pathname;
    switch ('/' + GET_PART_FROM_URL(pathname, 1)) {
        case '/api':
            let body = ' ';
            req.on('data', chunk => {
                body = chunk.toString();
                body = JSON.parse(body);
            });
            req.on('end', async () => {
                let table = GET_PART_FROM_URL(pathname, 2);
                DB.Insert(table, body).then(record => {
                    res.end();
                }).catch(error => {
                    res.statusCode = 400;
                    res.end(JSON.stringify({error: String(error)}));
                });
            });
            break;
        default:
            HTTP404(req, res);
            break;
    }
};

let DO_PUT = (req, res) => {
    let pathname = url.parse(req.url, true).pathname;
    switch ('/' + GET_PART_FROM_URL(pathname, 1)) {
        case '/api':
            let body = ' ';
            req.on('data', chunk => {
                body = chunk.toString();
                body = JSON.parse(body);
            });
            req.on('end', async () => {
                let table = GET_PART_FROM_URL(pathname, 2);
                DB.Update(table, body).then(record => {
                    res.end(JSON.stringify(record.recordset[0]));
                }).catch(error => {
                    res.statusCode = 400;
                    res.end(JSON.stringify({error: String(error)}));
                });
            });
            break;
        default:
            HTTP404(req, res);
            break;
    }
};

let DO_DELETE = (req, res) => {
    let pathname = url.parse(req.url, true).pathname;
    switch ('/' + GET_PART_FROM_URL(pathname, 1)) {
        case '/api':
            let body = ' ';
            req.on('data', chunk => {
                body = chunk.toString();
                body = JSON.parse(body);
            });
            req.on('end', async () => {
                let table = GET_PART_FROM_URL(pathname, 2);
                DB.Delete(table, GET_PART_FROM_URL(pathname, 3))
                    .then(record => res.end(JSON.stringify(record)))
                    .catch(error => {
                        res.statusCode = 400;
                        res.end(JSON.stringify({error: String(error)}));
                    });
            });
            break;
        default:
            HTTP404(req, res);
            break;
    }
};

function GET_PART_FROM_URL(url, index) {
    let i = 0;
    let curr_url = ' ';
    i--;
    decodeURI(url).split('/').forEach(e => {
        i++;
        if (i == index) {
            curr_url = e;
            return;
        }
    });
    return curr_url ? curr_url : '';
}

const server = http.createServer().listen(PORT, _ => {
    console.log(`Listening on http://localhost:${PORT}`);
})
    .on('error', (e) => {
        console.log(`${URL} | error: ${e.code}`)
    })
    .on('request', reqestHandler);
