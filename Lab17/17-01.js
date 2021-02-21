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

client.quit();
