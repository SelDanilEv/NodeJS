let http = require('http');
let query = require('querystring');
let fs = require('fs');


let infoPath = `/info`;
let param = ' ';
let options =
    {
        host: 'localhost',
        path: infoPath,
        port: 5000,
        method: 'GET'
    };

const task1 = http.request(options, (res) => {
    console.log('------------TASK1------------');
    console.log(`Method: ${task1.method}`);
    console.log(`StatusCode: ${res.statusCode}`);
    console.log(`StatusMessage: ${res.statusMessage}`);
    console.log(`RemoteAddress: ${task1.connection.remoteAddress}`);
    console.log(`RemotePort: ${task1.connection.remotePort}`);
    let data = '';
    res.on('data', (chunk) => {
        console.log('Data: ', data += chunk.toString());
    });
});


param = query.stringify({x: 3, y: 4});
options.path = `/params2?${param}`;
const task2 = http.request(options, (res) => {
    console.log('------------TASK2------------');
    console.log('Status: ' + res.statusCode + '. ' + res.statusMessage);
    let data = '';
    res.on('data', (chunk) => {
        console.log('Parameters: ', data += chunk.toString());
    });
});


param = query.stringify({x: 3, y: 4, s: 'Third parameter'});
options.path = `/params3?${param}`;
options.method = 'POST';
const task3 = http.request(options, (res) => {
    console.log('------------TASK3------------');
    console.log('Status: ' + res.statusCode + '. ' + res.statusMessage);
    let data = '';
    res.on('data', (chunk) => {
        console.log('Parameters: ', data += chunk.toString());
    });
});


options.path = `/json`;
options.headers = {'Content-Type': 'application/json', 'accept': 'application/json'};
const task4 = http.request(options, (res) => {
    console.log('------------TASK4------------');
    let data = '';
    res.on('data', (chunk) => {
        console.log('JSON: ', data += chunk.toString());
    });
});


options.path = `/xml`;
options.headers = {'Content-Type': 'text/xml', 'accept': 'text/xml'};
const task5 = http.request(options, (res) => {
    console.log('------------TASK5------------');
    let data = '';
    res.on('data', (chunk) => {
        console.log('XML:', data += chunk.toString());
    });
});


options.path = `/txt`;
options.headers = {'Content-Type': 'text/plain', 'accept': 'text/plain'};
const task6 = http.request(options, (res) => {
    console.log('------------TASK6------------');
    let data = '';
    res.on('data', (chunk) => {
        console.log('TXT: \n', data += chunk.toString());
    });
});


options.path = `/png`;
options.headers = {'Content-Type': 'image/png', 'accept': 'image/png'};
const task7 = http.request(options, (res) => {
    console.log('------------TASK7------------');
    let data = '';
    res.on('data', (chunk) => {
        console.log('PNG was sended');
    });
});


options.path = `/file`;
options.headers = {'Content-Type': 'text/plain', 'accept': 'text/plain'};
options.method = 'GET';
const task8 = http.request(options, (res) => {
    console.log('------------TASK8------------');
    let data = '';
    res.on('data', (chunk) => {
        console.log('File: \n', data += chunk.toString());
    });
});


task1.end();
task2.end();
task3.end();
task4.end(fs.readFileSync('../files/json.json'));
task5.end(fs.readFileSync('../files/xml.xml'));
task6.end(fs.readFileSync('../files/txt.txt'));
task7.end(fs.readFileSync('../files/png.png'));
task8.end();
