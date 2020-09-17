const express = require('express');
const bodyParser = require('body-parser');
const DataBase = require('./db/DataBase');
const fs = require('fs');
const NodeFetch = require("node-fetch");

const initialData = require('./db/data/notes.json')

const HOST = 'localhost';
const PORT = 5000;

const app = express();
const db = new DataBase(initialData);

app.use(bodyParser.json());

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
        await response.json(await db.getRows());
    });

db.on('post',
    async (request, response) => {
        if (isStatCollection) {
            lastStat.requests++;
        }
        let newNote = {
            name: request.body.name,
            birth: request.body.birth
        };
        await response.json(await db.addRow(newNote));
    });

db.on('put',
    async (request, response) => {
        if (isStatCollection) {
            lastStat.requests++;
        }
        let note = {
            id: request.body.id,
            name: request.body.name,
            birth: request.body.birth
        };
        await response.json(await db.updateRow(note));
    });

db.on('delete',
    async (request, response) => {
        if (isStatCollection) {
            lastStat.requests++;
        }
        await response.json(await db.removeRow(request.query.id));
    });

db.on('commit',
    async (request, response) => {
        if (isStatCollection) {
            lastStat.commits++;
        }
        await response.json(await db.stateCommit());
    });


app.get('/',
    (request, response) => {
        loadHTML(request, response, 'index.html');
    });


app.get('/commit',
    (request, response) => {
        db.emit('commit', request, response);
    });


app.get('/api/db',
    (request, response) => {
        db.emit('get', request, response);
    });

app.post('/api/db',
    (request, response) => {
        db.emit('post', request, response);
    });

app.put('/api/db',
    (request, response) => {
        db.emit('put', request, response);
    });

app.delete('/api/db',
    (request, response) => {
        db.emit('delete', request, response);
    });


app.get('/api/ss', (request, response) => {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(returnJsonStat());
});


app.listen(PORT, HOST, () => {
    console.log('Listening on ' + `http://${HOST}:${PORT}`);
});


const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let shotDown;
let autoCommit;
let isStatCollection = false;
let lastStat;
let autoFinishCollectStat;
let startCollectTime;

let clearStat = {
    seconds: 0,
    requests: 0,
    commits: 0
};

function printStat() {
    console.log(returnJsonStat());
    isStatCollection = false;
}

function returnJsonStat() {
    if(isStatCollection) {
        lastStat.seconds = Math.round((Date.now() - startCollectTime) / 1000);
    }
    return JSON.stringify(lastStat);
}

rl.on('line', (input) => {
    let args = input.split(' ');
    console.log(args);
    switch (args[0]) {
        case 'sd':
            clearTimeout(shotDown);
            if (args[1] != undefined && (typeof +args[1] == 'number')) {
                shotDown = setTimeout(() => {
                    console.log('Server turning off ...\n');
                    app.terminate();
                }, args[1] * 1000);
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
                    console.log('Statistics will be in ' + args[1] + "sec.\n");
                } else {
                    console.log('No param\n');
                }
            }
            break;
    }
});