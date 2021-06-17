const request = require('request-promise');
const {ClientVerify} = require("./sign");
const fs = require('fs')

let clientFunc = async () => {
    await request({
        method: 'GET',
        uri: 'http://localhost:3000/file',
        headers: {
            "application": "application/txt"
        }
    }).then(( response) => {
            response = JSON.parse(response);
            fs.writeFileSync('./client.txt', response.file);

            let rs = fs.createReadStream('./client.txt');
            console.log(response.signContext)
            let cv = new ClientVerify(response.signContext);
            cv.verify(rs, (result) => {
                if (result) {
                    console.log("the signature is correct");
                } else {
                    console.log("the signature is incorrect");
                }
            })
        }
    )
        .catch((err) => {
            console.log(err);
        })
}

clientFunc();
