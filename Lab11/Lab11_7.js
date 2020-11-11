const rpcWSS = require('rpc-websockets').Server

const eventSocket = new rpcWSS({
    port: 4000,
    host: 'localhost',
    path: '/'
});

eventSocket.event('A');
eventSocket.event('B');
eventSocket.event('C');

eventSocket.on('connection', () => {
    eventSocket.on('A', () => console.log('A event was fired'));
    eventSocket.on('B', () => console.log('B event was fired'));
    eventSocket.on('C', () => console.log('C event was fired'));
});

eventSocket.register('A', (params) => {
    eventSocket.emit("A");
    return 'A';
}).public();

eventSocket.register('B', (params) => {
    eventSocket.emit("B");
    return 'B';
}).public();

eventSocket.register('C', (params) => {
    eventSocket.emit("C");
    return "C";
}).public();
