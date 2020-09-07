'use strict'

let fs = require('fs');
let expt = require('express');
let app = expt();


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

function getTickFact(n) {
    if (n < 0) return 0;
    return (n > 1) ? n * process.nextTick(() => getTickFact(n - 1)) : 1;
}


function testFact(req, res) {
    let k = req.query.k;
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
    for (let k = 1; k < 605; k++) {
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
    for (let k = 1; k < 605; k++) {
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
    for (let k = 1; k < 100; k++) {
            result += (n++) + '.Результат: ' + (Date.now() - d) + '-' + k + '/' + getSimpleFact(k) + '<br/>';
            await sleep(1);
    }


    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    setTimeout(() =>
        res.end(result), 100);
}


app.get("/", (response, request) => init(response, request));
app.post("/", (response, request) => init(response, request));

app.get("/fact", ((req, res) => testFact(req, res)));
app.get("/factCycle", ((req, res) => factCycle(req, res)));
app.get("/factCycleS", ((req, res) => factCycleS(req, res)));
app.get("/factCycleTick", ((req, res) => factCycleTick(req, res)));
app.get("/factCycleImmediate", ((req, res) => factCycleImmediate(req, res)));

app.listen(5000);

console.log('Server running at http://localhost:5000/');
