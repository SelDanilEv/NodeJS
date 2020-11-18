const rpcWSS = require('rpc-websockets').Server

const wss = new rpcWSS({
    port: 4000,
    host: 'localhost',
    path: '/'
});

wss.event('A');
wss.event('B');
wss.event('C');
let input = process.stdin;
input.setEncoding('utf-8');
process.stdout.write('> ');
input.on('data', data => {
    data.split(/\s/).forEach((item)=>{
        wss.emit(item);
    })
    process.stdout.write('> ');
});
