const rpc = require('rpc-websockets').Client;
const ws = new rpc('ws://localhost:4000');

let input = process.stdin;
input.setEncoding('utf-8');

ws.on('open', () => {
    input.on('data', data => {
        data.split(/\s/).forEach((item)=>{
            ws.notify(item);
        })
    });

    ws.on('error', (e) => {
        console.log('wss server error', e)
    });
});
