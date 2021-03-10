const express = require("express");
const app = express();
const pulpitRouter = require("./routers/pulpitRouter.js");
const facultyRouter = require("./routers/facultyRouter.js");
const homeRouter = require("./routers/homeRouter.js");
const sequelize = require("./db_connection.js");
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use("/pulpits", pulpitRouter);
app.use("/faculties", facultyRouter);
app.use("/", homeRouter);

app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

sequelize.authenticate()
    .then(() => {
        console.log('Соединение с базой данных установлено');
    })
    .catch(err => {
        console.log('Ошибка при соединении с базой данных', err.message);
    });

app.listen(3000,()=>{console.log('Listening on http://localhost:3000`');});
