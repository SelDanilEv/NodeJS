const rpcWSS = require('rpc-websockets').Server

const eventSocket = new rpcWSS({
    port: 4000,
    host: 'localhost',
    path: '/'
});

eventSocket.event('A');
eventSocket.event('B');
eventSocket.event('C');
let input = process.stdin;
input.setEncoding('utf-8');
process.stdout.write('> ');
input.on('data', data => {
    data.split(/\s/).forEach((item)=>{
        eventSocket.emit(item);
    })
    process.stdout.write('> ');
});
