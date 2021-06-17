const express = require('express');
const path = require('path')
const fs = require('fs')
const app = express();

const wfile = "Source0.wasm";
const wasmPath = path.resolve(__dirname + '/../' + wfile);
const wasmCode = fs.readFileSync(wasmPath);
const wasmImports = {};
const wasmModule = new WebAssembly.Module(wasmCode);
const wasmInstance = new WebAssembly.Instance(wasmModule, wasmImports);

app.get('/', (request, response) => {
    response.sendFile(__dirname + '\\index.html');
});

app.get('/wasm', (request, response) => {
    response.sendFile(wasmPath);
});

app.get('/wasm3', (request, response) => {
    response.send(JSON.stringify([0, 97, 115, 109, 1, 0, 0, 0, 1, 135, 128, 128, 128, 0, 1, 96, 2, 127, 127, 1, 127, 3, 132, 128, 128, 128, 0, 3, 0, 0, 0, 4, 132, 128, 128, 128, 0, 1, 112, 0, 0, 5, 131, 128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 156, 128, 128, 128, 0, 4, 6, 109, 101, 109, 111, 114, 121, 2, 0, 3, 115, 117, 109, 0, 0, 3, 109, 117, 108, 0, 1, 3, 115, 117, 98, 0, 2, 10, 165, 128, 128, 128, 0, 3, 135, 128, 128, 128, 0, 0, 32, 1, 32, 0, 106, 11, 135, 128, 128, 128, 0, 0, 32, 1, 32, 0, 108, 11, 135, 128, 128, 128, 0, 0, 32, 0, 32, 1, 107, 11]));
});

app.listen(3000, () => {
    console.log('Second task: http://localhost:3000');
});
