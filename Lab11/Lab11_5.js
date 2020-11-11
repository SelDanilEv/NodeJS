const rpcWSS = require('rpc-websockets').Server

let server = new rpcWSS({port: 4000, host: 'localhost'});

server.setAuth(credentials => credentials.login === 'Defender' && credentials.password === 'Defender');

server.register('square', (params) => {
    if (params.length == 2) {
        return params[0] * params[1];
    }
    return params[0] ** 2 * Math.PI;
}).public();

server.register('sum', (params) => {
    let sum = 0;
    params.forEach(function (item, i, params) {
        if (Number.isInteger(item))
            sum += item;
    })
    return sum;
}).public()

server.register('mul', (params) => {
    let mul = 1;
    params.forEach(function (item, i, params) {
        if (Number.isInteger(item))
            mul *= item;
    })
    return mul;
}).public();

function fib(n) {
    let fibonacci = [0, 1];

    for (let i = 2; i < n; i++) {
        fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
    }
    return fibonacci;
}

server.register('fib', (param) => {
    if (param.length == 1) {
        console.log(param)
        return fib(param)
    } else {
        return [1]
    }
}).protected();

function factorial(n) {
    return (n != 1) ? n * factorial(n - 1) : 1;
}

server.register('fact', (param) => {
    if (param.length == 1) {
        console.log(param)
        return factorial(param)
    } else {
        return [1]
    }
}).protected();
