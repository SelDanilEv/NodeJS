'use strict'

let fs = require('fs');
let expt = require('express');
let app = expt();

function png(response, request) {
    const path = './../img/bk.png';
    let png = null;
    fs.stat(path, (err, stat) => {
        if (err) {
            console.log('error', err);
        } else {
            png = fs.readFileSync(path);
            request.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': stat.size});
            request.end(png, 'binary');
        }
    });
}

function xmlhttprequest(response, request) {
    let source = 'xmlhttprequest.html';
    let html = fs.readFileSync(source);
    request.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    request.end(html);
}

function jquery(response, request) {
    let source = 'jQuery.html';
    let html = fs.readFileSync(source);
    request.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    request.end(html);
}

function fetch(response, request) {
    let source = 'fetch.html';
    let html = fs.readFileSync(source);
    request.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    request.end(html);
}

function info(response, request) {
    let source = 'info.txt';
    let html = fs.readFileSync(source);
    request.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    request.end(html);
}

function html(response, request) {
    let source = 'index.html';
    let html = fs.readFileSync(source);
    request.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    request.end(html);
}

app.get("/", (response, request) => html(response, request));
app.post("/", (response, request) => html(response, request));

app.get("/html", (response, request) => html(response, request));
app.post("/html", (response, request) => html(response, request));

app.get("/png", (response, request) => png(response, request));
app.post("/png", (response, request) => png(response, request));

app.get("/api/name", (response, request) => info(response, request));
app.post("/api/name", (response, request) => info(response, request));

app.get("/fetch", (response, request) => fetch(response, request));
app.post("/fetch", (response, request) => fetch(response, request));

app.get("/jquery", (response, request) => jquery(response, request));
app.post("/jquery", (response, request) => jquery(response, request));

app.get("/xmlhttprequest", (response, request) => xmlhttprequest(response, request));
app.post("/xmlhttprequest", (response, request) => xmlhttprequest(response, request));

app.listen(5000);

console.log('Server running at http://localhost:5000/');
