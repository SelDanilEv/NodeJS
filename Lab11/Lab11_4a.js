const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:4000');


let name = 'Defender' + Date.now()%100;

ws.on('open', ()=>{

    ws.on('message', (data)=>{
        data =  JSON.parse(data);
        console.log('on message: ', data);
    })

    setInterval(()=>{ws.send(JSON.stringify({x: name, t: new Date().toISOString()}))}, 3000)
})

ws.on('error', (e)=>{console.log('wss server error', e)})
