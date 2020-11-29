const sql = require('mssql');
const fs = require('fs');

let connectionPool;
const config =
    {
        user: 'sa',
        password: fs.readFileSync('../dbpassword.txt', 'utf8').trimEnd(),
        server: 'DEFENDER-SD',
        Database: 'NodeJS_University'
    };

let dbname = 'use NodeJS_University; ';

class DB {
    constructor() {
        connectionPool = new sql.ConnectionPool(config).connect().then(pool => {
            console.log('Connected to MSSQL')
            return pool
        }).catch(err => console.log('Connection Failed: ', err));
    }

    Get(table) {
        return connectionPool.then(pool => pool.query(`${dbname} SELECT * FROM ${table}`));
    }

    Update(table, fields) {
        return connectionPool.then(pool => {
            let req = pool.request();
            let command = `${dbname} UPDATE ${table} SET `;
            let tableid = '';
            Object.keys(fields).forEach(field => {
                if (!(field===table))
                    command += `${field} = '${fields[field]}',`;
                else tableid = fields[field];
            });
            command = command.slice(0, -1);
            command += ` WHERE ${table} = '${tableid}'`;
            console.log('|' + command + '|');
            req.query(command);
        });
    }

    Insert(table, fields) {
        return connectionPool.then(pool => {
            const req = pool.request();
            let command = `${dbname} INSERT INTO ${table} values (`;
            Object.keys(fields).forEach(field => {
                let fieldType = Number.isInteger(fields[field]) ? sql.Int : sql.NVarChar;
                req.input(field, fieldType, fields[field]);
                command += `@${field},`;
            });
            command = command.replace(/.$/, ")");
            return req.query(command);
        });
    }

    Delete(table, id) {
        return connectionPool.then(pool => {
            if (!id)
                throw 'Problem with ID';
            return pool.query(`${dbname} DELETE FROM ${table} WHERE ${table} = '${id}'`);
        });
    }
}

module.exports = DB;
