const udp = require('dgram');


const PORT = 4000;
let client = udp.createSocket('udp4')

client.on('message', (msg, info) => {
    let message = msg.toString();
    console.log(`Server ${info.address}:${info.port} = ${message}`);
})
    .on('error', (err) => {
        console.log('Error: ' + err);
        client.close();
    });


client.send('Hello udp server', PORT, 'localhost', (err) => {
    if (err) client.close();
    else console.log('Good');
});
