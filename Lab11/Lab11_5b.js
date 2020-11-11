const async = require('async')
const rpcWSC = require('rpc-websockets').Client

let ws = new rpcWSC('ws://localhost:4000');

let h = (x = ws) => async.parallel({
    square: (cb) => {
        ws.call('square', [5,100]).catch((e) => cb(e, null)).then((r) => cb(null, r));
        console.log('square');
    },
    sum: (cb) => {
        ws.call('sum', [3, 4, 5,99,1]).catch((e) => cb(e, null)).then((r) => cb(null, r));
        console.log('sum');
    },
    mul: (cb) => {
        ws.call('mul', [5, 4, 3]).catch((e) => cb(e, null)).then((r) => cb(null, r));
        console.log('mul');
    },
    fib: (cb) => {
        ws.login({login: 'Defender', password: 'Defender'})
            .then((login) => {
                ws.call('fib', [5]).catch((e) => cb(e, null)).then((r) => cb(null, r));
            });
        console.log('fib');
    }
}, (e, r) => {
    if (e)
        console.log('error =', e)
    else
        console.log('result =', r)
    ws.close();
})
ws.on('open', h)
