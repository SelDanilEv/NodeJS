const Db = require('./queries');
const fs = require('fs');
let url = require("url");
const http = require('http');
const DB = new Db();

const PORT = 3000;

let HTTP404 = (req, res) => {
    res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(`"error" : "${req.method}: ${req.url}, HTTP status 404"`);
}

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
    let Path_forGet = url.parse(req.url, true).pathname;
    switch ('/' + GetUrlPart(Path_forGet, 1)) {
        case '/ ':
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(fs.readFileSync(__dirname + '/index.html'));
            break;
        case '/api':
            let table = GetUrlPart(Path_forGet, 2);
            DB.GetTable(table).then(records => res.end(JSON.stringify(records)))
                .catch(error => {
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
    let Path_forGet = url.parse(req.url, true).pathname;
    switch ('/' + GetUrlPart(Path_forGet, 1)) {
        case '/api':
            let body = ' ';
            req.on('data', chunk => {
                body = chunk.toString();
                body = JSON.parse(body);
            });
            req.on('end', async () => {
                let table = GetUrlPart(Path_forGet, 2);
                DB.InsertField(table, body)
                    .then(_ => res.end())
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

let DO_PUT = (req, res) => {
    let Path_forGet = url.parse(req.url, true).pathname;
    switch ('/' + GetUrlPart(Path_forGet, 1)) {
        case '/api':
            let body = ' ';
            req.on('data', chunk => {
                body = chunk.toString();
                body = JSON.parse(body);
            });
            req.on('end', async () => {
                let table = GetUrlPart(Path_forGet, 2);
                let id = body._id;
                delete body._id;
                DB.UpdateField(table, id, body)
                    .then(_ => res.end())
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

let DO_DELETE = (req, res) => {
    let Path_forGet = url.parse(req.url, true).pathname;
    switch ('/' + GetUrlPart(Path_forGet, 1)) {
        case '/api':
            let body = ' ';
            req.on('data', chunk => {
                body = chunk.toString();
                body = JSON.parse(body);
            });
            req.on('end', async () => {
                let table = GetUrlPart(Path_forGet, 2);
                DB.DeleteField(table, GetUrlPart(Path_forGet, 3))
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

function GetUrlPart(url, index) {
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
    return curr_url ? curr_url : ' ';
}

const server = http.createServer().listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})
    .on('error', (e) => {
        console.log(`${URL} | error: ${e.code}`)
    })
    .on('request', http_handler);
