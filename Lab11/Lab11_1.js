const fs = require('fs');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port:4000, host:'localhost'});

let k = 0;
wss.on('connection', (ws)=>{
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let wfile = fs.createWriteStream(`./../upload/newFile${++k}.txt`);
    duplex.pipe(wfile);
})
