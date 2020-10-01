// document.body.innerHTML = "<h1>Hello World</h1>";
// setInterval(()=>{document.body.innerHTML = "";},3000);

var http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': ''});
    response.end('<h1>Hello World</h1>');
}).listen(3000);

console.log(('Server running at http://localhost:3000/'));





