const sequelize = require("../db_connection.js");
const {FACULTY, PULPIT, TEACHER, SUBJECT, AUDITORIUM_TYPE, AUDITORIUM}=require('..\\models\\db_schema').ORM(sequelize);

exports.addPulpit = function (request, response){
    PULPIT.create({PULPIT: request.body.PULPIT, PULPIT_NAME: request.body.PULPIT_NAME, FACULTY: request.body.FACULTY})
        .catch((err)=>console.log('Error: '+ err.message));
    response.send("Добавление кафедры");
};

exports.getPulpits = function(request, response){
    PULPIT.findAll().then(rec=>response.send(JSON.stringify(rec)))
        .catch((err)=>console.log('Error: '+ err.message));
};

exports.updatePulpit=function(request, response){
    PULPIT.update(
        {PULPIT_NAME: request.body.PULPIT_NAME,
            FACULTY: request.body.FACULTY},
        {where: {PULPIT: request.query.PULPIT}}
    ).catch((err)=>console.log('Error: '+ err.message));
    response.send('Изменение кафедры');
}

exports.deletePulpit=function (request, response){
    PULPIT.destroy({where:{PULPIT: request.query.id}})
        .catch((err)=>console.log('Error: '+ err.message));
    response.send('Удаление кафедры');
}
