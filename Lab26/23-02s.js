const express = require('express');
const bodyParser = require('body-parser');
const {ServerSign} = require('./sign');
const fs = require('fs')

const app = express();
app.use(bodyParser.json());

app.get('/file', (async (req, res) => {
    try {
        const text = fs.readFileSync('server_file_2.txt', {encoding: 'utf8'});
        let result = {};
        result.file = text;
        let ss = new ServerSign();
        const rs = fs.createReadStream('./server_file_2.txt');
        await ss.getSignContext(rs, async (signContext) => {
            console.log(signContext);
            result.signContext = signContext
            res.send(JSON.stringify(result));
        })
    } catch (e) {
        res.status(409).json({message: 'error in verification'});
    }
}))

app.listen(3000);
