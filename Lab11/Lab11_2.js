const fs = require('fs');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port:4000, host:'localhost'});

wss.on('connection', (ws)=>{
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let rfile = fs.createReadStream(`./../files/MyFile.txt`);
    rfile.pipe(duplex);
})

