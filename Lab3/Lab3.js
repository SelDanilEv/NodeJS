'use strict'

let fs = require('fs');
let http = require('http');
let url = require('url');

function init(response, request) {
    let source = 'index.html';
    let html = fs.readFileSync(source);
    request.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    request.end(html);
}

function getSimpleFact(n) {
    if (n < 0) return 0;
    return (n > 1) ? n * getSimpleFact(n - 1) : 1;
}

function testFact(req, res) {
    let k = url.parse(req.url, true).query.k;
    let json = {k: k, fact: getSimpleFact(k)};
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(json));
}

function factCycle(req, res) {
    let source = 'factCycle.html';
    let html = fs.readFileSync(source);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function factCycleTick(req, res) {
    let result = "";
    let n = 1;
    const d = Date.now();
    for (let k = 1; k < 1000; k++) {
        process.nextTick(async () => {
            result += (n++) + '.Результат: ' + (Date.now() - d) + '-' + k + '/' + getSimpleFact(k) + '<br/>';
            await sleep(1);
        });
    }


    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    setTimeout(() =>
        res.end(result), 100);
}

async function factCycleImmediate(req, res) {
    let result = "";
    let n = 1;
    const d = Date.now();
    for (let k = 1; k < 1000; k++) {
        setImmediate(async () => {
            result += (n++) + '.Результат: ' + (Date.now() - d) + '-' + k + '/' + getSimpleFact(k) + '<br/>';
            await sleep(1);
        });
    }


    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    setTimeout(() =>
        res.end(result), 100);
}

async function factCycleS(req, res) {
    let result = "";
    let n = 1;
    const d = Date.now();
    for (let k = 1; k < 1000; k++) {
        result += (n++) + '.Результат: ' + (Date.now() - d) + '-' + k + '/' + getSimpleFact(k) + '<br/>';
        await sleep(1);
    }

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    setTimeout(() =>
        res.end(result), 100);
}

let DO_GET = (req, res) => {
    switch (req.url.split('?')[0]) {
        case '/fact':
            testFact(req, res)
            break;
        case '/factCycle':
            factCycle(req, res)
            break;
        case '/factCycleS':
            factCycleS(req, res)
            break;
        case '/factCycleTick':
            factCycleTick(req, res)
            break;
        case '/factCycleImmediate':
            factCycleImmediate(req, res)
            break;
        default:
            init(req, res)
            break;
    }
};

let http_handler = (req, res) => {
    switch (req.method) {
        case 'GET':
            DO_GET(req, res);
            break;
    }
};

const server = http.createServer().listen(5000, () => {
    console.log('Server running at http://localhost:5000/');
})
    .on('request', http_handler);
