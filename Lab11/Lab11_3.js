const WebSocket = require('ws');
const wss = new WebSocket.Server({port:4000, host:'localhost'});

let counter = 0;
wss.on('connection', (ws)=>{
    console.log("Client"+ ++counter);
})
wss.on('disconnection', (ws)=>{
    console.log("Client"+ --counter);
})
wss.on('error', (e)=>{console.log('wss server error', e)})

setInterval(()=>{console.log(wss.clients.size)}, 10000)

