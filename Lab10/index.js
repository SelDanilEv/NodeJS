const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

const PORT = 3000;
const HOST = 'localhost';

const webSocketServer = new WebSocket.Server({port: 4000, host: HOST, path: '/wsserver'});
const webSocketServerBroadcast = new WebSocket.Server({port: 5000, host: HOST, path: '/broadcast'});

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

function start(req,res){
    loadHTML(req, res, "index.html");
}

let k = 0;
let mess = 0;
webSocketServer.on('connection', (ws) => {
    console.log('WS connection');
    ws.on('message', message => {
        mess = message;
        console.log(`client=> ${message}; server=> ${k}`);
    });
    let timer = setInterval(() => ws.send(`10-01-server: ${mess}->${k++}`), 5000);

})
    .on('error', (e) => {
        console.log('WS server error ', e);
    });

let broadcastCounter =0;
webSocketServerBroadcast.on('connection', (ws) => {
    console.log('WS broadcast connection '+ ++broadcastCounter);
    ws.on('message', message => {
        webSocketServerBroadcast.clients.forEach((client) => {
            console.log('Client message: ' + message);
            if (client.readyState === WebSocket.OPEN)
                client.send('Server -> ' + message)
        });
    });
});

webSocketServerBroadcast.on('open', () => {
    let k = 0;
    let timer = setInterval(() => webSocketServerBroadcast.send(`Client: -${k++}`));
    webSocketServerBroadcast.on('message', (message) => {
        console.log(`Received message => ${message}`);
    });

    setTimeout(() => {
        clearInterval(timer);
        webSocketServerBroadcast.close();
    }, 25000);
})
    .on('error', (e) => {
        console.log('WS server error ', e);
    });

let server = http.createServer();
server.listen(5000, () => {
    console.log('Server running at http://localhost:5000')
})
    .on('request', start);

