const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 4000, host: 'localhost'});

wss.on('connection', (ws) => {
    let data_saver;
    ws.on('message', (data) => {
        data_saver = JSON.parse(data);
        console.log('on message: ', data);
    });

    let count_of_messages = 0;
    setInterval(() => {
        ws.send(JSON.stringify({n: count_of_messages++, x: data_saver.x, t: new Date().toString()}))
    }, 5000);
})

wss.on('error', (e) => {
    console.log('wss server error', e)
})
