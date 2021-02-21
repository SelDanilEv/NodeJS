const redis = require("redis");

const sub_client = redis.createClient('//redis-17960.c239.us-east-1-2.ec2.cloud.redislabs.com:17960',
    {password: 'VgbXkKe6x3OVdrAz8JYLiNYLiF85THvr'});

sub_client.on('subscribe', (channel, count) => {
    console.log('subscribe:', ' channel = ', channel, 'count = ', count);
});
sub_client.on('message', (channel, message) => {
    console.log('sub channel: ' + channel + ': ' + message);
});

sub_client.subscribe('channel-01');

setTimeout(() => {
    sub_client.unsubscribe();
    sub_client.quit()
}, 90000);
