const rpcWSS = require('rpc-websockets').Server

const wss = new rpcWSS({
    port: 4000,
    host: 'localhost',
    path: '/'
});

wss.event('A');
wss.event('B');
wss.event('C');

wss.on('connection', () => {
});

wss.register('A', (params) => {
    console.log('A event now')
    return 'A';
}).public();

wss.register('B', (params) => {
    console.log('B event now')
    return 'B';
}).public();

wss.register('C', (params) => {
    console.log('C event now')
    return "C";
}).public();
