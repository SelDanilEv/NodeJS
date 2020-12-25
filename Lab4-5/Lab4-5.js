const http = require('http');
const bodyParser = require('body-parser');
const DataBase = require('./db/DataBase');
const fs = require('fs');
const NodeFetch = require("node-fetch");
let url = require('url');

const initialData = require('./db/data/notes.json')

const db = new DataBase(initialData);

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

db.on('get',
    async (request, response) => {
        if (isStatCollection) {
            lastStat.requests++;
        }
        response.end(JSON.stringify(await db.getRows()));
    });

db.on('post',
    async (request, response) => {
        let newNote;
        request.on('data', chunk => {
            newNote = chunk.toString();
            newNote = JSON.parse(newNote);
        });
        request.on('end', async () => {
            if (isStatCollection) {
                lastStat.requests++;
            }
            response.end(JSON.stringify(await db.addRow(newNote)));
        });
    });

db.on('put',
    async (request, response) => {
        let note;
        request.on('data', chunk => {
            note = chunk.toString();
            note = JSON.parse(note);
        });
        request.on('end', async () => {
            if (isStatCollection) {
                lastStat.requests++;
            }
            response.end(JSON.stringify(await db.updateRow(note)));
        });
    });

db.on('delete',
    async (request, response) => {
        if (isStatCollection) {
            lastStat.requests++;
        }
        response.end(
            JSON.stringify(
                await db.removeRow(
                    url.parse(request.url, true).query.id)));
    });

db.on('commit',
    async (request, response) => {
        if (isStatCollection) {
            lastStat.commits++;
        }
        response.end(JSON.stringify(await db.stateCommit()));
    });


let DO_GET = (req, res) => {
    switch (req.url.split('?')[0]) {
        case '/commit':
            db.emit('commit', req, res);
            break;
        case '/api/db':
            db.emit('get', req, res);
            break;
        case '/api/ss':
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(returnJsonStat());
            break;
        default:
            loadHTML(req, res, 'index.html');
            break;
    }
};

let DO_POST = (req, res) => {
    switch (req.url.split('?')[0]) {
        case '/api/db':
            db.emit('post', req, res);
            break;
    }
};

let DO_PUT = (req, res) => {
    switch (req.url.split('?')[0]) {
        case '/api/db':
            db.emit('put', req, res);
            break;
    }
};

let DO_DELETE = (req, res) => {
    switch (req.url.split('?')[0]) {
        case '/api/db':
            db.emit('delete', req, res);
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


const server = http.createServer().listen(5000, () => {
    console.log('Server running at http://localhost:5000/');
})
    .on('request', http_handler);


const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let clearStat = {
    seconds: 0,
    requests: 0,
    commits: 0
};

let shotDown;
let autoCommit;
let isStatCollection = false;
let lastStat = clearStat;
let autoFinishCollectStat;
let startCollectTime;


function printStat() {
    console.log(returnJsonStat());
    isStatCollection = false;
}

function returnJsonStat() {
    if (isStatCollection) {
        lastStat.seconds = Math.round((Date.now() - startCollectTime) / 1000);
    }
    return JSON.stringify(lastStat);
}

rl.on('line', (input) => {
    let args = input.split(' ');
    switch (args[0]) {
        case 'sd':
            clearTimeout(shotDown);
            if (args[1] != undefined && (typeof +args[1] == 'number')) {
                shotDown = setTimeout(() => {
                    console.log('Server turning off ...\n');
                    //app.close();
                    process.exit(0);
                }, args[1] * 1000);
                shotDown.unref();
                console.log('Server will be turn off after ' + args[1] + ' sec\n');
            } else {
                console.log('Auto shot down turn off\n');
            }
            break;
        case 'sc':
            clearInterval(autoCommit);
            if (args[1] != undefined && (typeof +args[1] == 'number')) {
                autoCommit = setInterval(() => {
                    NodeFetch('http://localhost:5000/commit', {method: 'Get'})
                }, args[1] * 1000);
                autoCommit.unref();
                console.log('Auto commit every ' + args[1] + ' sec\n');
            } else {
                console.log('Auto commit turn off\n');
            }
            break;
        case 'ss':
            if (isStatCollection) {
                clearTimeout(autoFinishCollectStat);
                printStat();
            } else {
                if (args[1] != undefined && (typeof +args[1] == 'number')) {
                    startCollectTime = Date.now();
                    lastStat = clearStat;
                    isStatCollection = true;
                    autoFinishCollectStat = setTimeout(() => {
                        printStat();
                    }, args[1] * 1000);
                    autoFinishCollectStat.unref();
                    console.log('Statistics will be in ' + args[1] + "sec.\n");
                } else {
                    console.log('No param\n');
                }
            }
            break;
    }
});
