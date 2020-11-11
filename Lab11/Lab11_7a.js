const rpc = require('rpc-websockets').Client;
const eventSocket = new rpc('ws://localhost:4000');

let input = process.stdin;
input.setEncoding('utf-8');

eventSocket.on('open', () => {
    input.on('data', data => {
        data.split(/\s/).forEach((item) => {
            eventSocket.call(item, []).then((r) => {
                process.stdout.write('> ' + r + '\n');
            }).catch((e) => {
            })
        })
    });

    eventSocket.on('error', (e) => {
        console.log('wss server error', e)
    })
});
