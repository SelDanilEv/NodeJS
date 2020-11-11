const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8'});

duplex.pipe(process.stdout)

process.stdin.pipe(duplex)

ws.on('pong', ()=>{
    console.log('server: pong');
})

setInterval(()=>{console.log('client: ping'); ws.ping()}, 15000)
