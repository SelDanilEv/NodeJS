var redis = require("redis");

const client = redis.createClient('//redis-17960.c239.us-east-1-2.ec2.cloud.redislabs.com:17960',
    {password: 'VgbXkKe6x3OVdrAz8JYLiNYLiF85THvr'});

module.exports = {
    AddBlackList: (username, jwt) => {
        client.get(username, (err, result) => {
            if (result == null) {
                client.set(username, jwt);
            } else {
                client.set(username, result + "|" + jwt);
            }
            client.get(username, async (err, result) => {
                console.log(result.split("|"));
            });
        });
    },
    GetAll: async (username) => {
        return await client.get(username, async (err, result) => {
            return await result.split("|");
        });
    },
    CheckBlackList: async (username, jwt) => {
        return new Promise(function (resolve, reject) {
            client.get(username, (err, result) => {
                if (result == null) resolve(true);
                else {
                    let res = result.split("|");
                    console.log(res.indexOf(jwt));
                    if (res.indexOf(jwt) == -1) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    },
};
