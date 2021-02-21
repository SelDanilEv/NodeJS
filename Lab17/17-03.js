const redis = require("redis");

const client = redis.createClient('//redis-17960.c239.us-east-1-2.ec2.cloud.redislabs.com:17960',
    {password: 'VgbXkKe6x3OVdrAz8JYLiNYLiF85THvr'});

client.on("ready", () => {
    console.log("ready");
});
client.on("error", (err) => {
    console.log("error " + err);
});
client.on("connect", () => {
    console.log("connect");
});
client.on("end", () => {
    console.log("end");
});

function Set(){
    const time1= Date.now();
    for (let k = 1; k <= 10000; k++) {
        client.set(k, k);
    }
    console.log(Date.now()-time1);
}

function Incr(){
    const time1= Date.now();
    for (let k = 1; k <= 10000; k++) {
        client.incr(k);
    }
    console.log(Date.now()-time1);
}

function Decr(){
    const time1= Date.now();
    for (let k = 1; k <= 10000; k++) {
        client.decr(k);
    }
    console.log(Date.now()-time1);
}

Promise.resolve()
    .then(Set())
    .then(Incr())
    .then(Decr());

client.quit();
