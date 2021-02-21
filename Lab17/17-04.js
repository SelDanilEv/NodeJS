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


function Hset(){
    const time1= Date.now();
    for (let k = 1; k < 10000; k++) {
        client.hset( 'number',k, JSON.stringify({id: k, val: 'val-'+k}) /*, (err, result)=>{
            console.log(k, 'err =', err, 'result =', result)}*/);
    }
    console.log(Date.now()-time1);
}

function Hget(){
    const time1= Date.now();
    for (let k = 1; k < 10000; k++) {
        client.hget('number', k/*, (err, result)=>{
            console.log(k+':', 'err =', err, 'result =', JSON.parse(result))}*/);
    }
    console.log(Date.now()-time1);
}

Promise.resolve()
    .then(Hset())
    .then(Hget());
client.quit();
