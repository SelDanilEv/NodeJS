const Sequelize = require('sequelize');
const sequelize = new Sequelize('NodeJS_University', 'sa', '123qweASD', {host: 'DEFENDER-SD', dialect: 'mssql'});

module.exports=sequelize;
