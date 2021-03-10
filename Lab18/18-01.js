const http = require('http');
const fs = require('fs');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('NodeJS_University', 'sa', '123qweASD', {host: 'DEFENDER-SD', dialect: 'mssql'});
const Model = Sequelize.Model;

class FACULTY extends Model {
};

class PULPIT extends Model {
};

class TEACHER extends Model {
};

class SUBJECT extends Model {
};

class AUDITORIUM_TYPE extends Model {
};

class AUDITORIUM extends Model {
};

function internalORM(sequelize) {
    FACULTY.init(
        {
            FACULTY: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
            FACULTY_NAME: {type: Sequelize.STRING, allowNull: false}
        },
        {
            hooks: {
                beforeCreate: (instance, options) => {
                    console.log('---------- faculty beforeCreate hook -----------');
                },
                afterCreate: (instance, options) => {
                    console.log('---------- faculty afterCreate hook ------------');
                }
            },
            sequelize, modelName: 'FACULTY', tableName: 'FACULTY', timestamps: false
        }
    );
    PULPIT.init(
        {
            PULPIT: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
            PULPIT_NAME: {type: Sequelize.STRING, allowNull: false},
            FACULTY: {
                type: Sequelize.STRING, allowNull: false,
                references: {model: FACULTY, key: 'FACULTY'}
            }
        },
        {sequelize, modelName: 'PULPIT', tableName: 'PULPIT', timestamps: false}
    );
    TEACHER.init(
        {
            TEACHER: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
            TEACHER_NAME: {type: Sequelize.STRING, allowNull: false},
            PULPIT: {
                type: Sequelize.STRING, allowNull: false,
                references: {model: PULPIT, key: 'PULPIT'}
            }
        },
        {sequelize, modelName: 'TEACHER', tableName: 'TEACHER', timestamps: false}
    );
    SUBJECT.init(
        {
            SUBJECT: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
            SUBJECT_NAME: {type: Sequelize.STRING, allowNull: false},
            PULPIT: {
                type: Sequelize.STRING, allowNull: false,
                references: {model: PULPIT, key: 'PULPIT'}
            }
        },
        {sequelize, modelName: 'SUBJECT', tableName: 'SUBJECT', timestamps: false}
    );
    AUDITORIUM_TYPE.init(
        {
            AUDITORIUM_TYPE: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
            AUDITORIUM_TYPENAME: {type: Sequelize.STRING, allowNull: false}
        },
        {sequelize, modelName: 'AUDITORIUM_TYPE', tableName: 'AUDITORIUM_TYPE', timestamps: false}
    );
    AUDITORIUM.init(
        {
            AUDITORIUM: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
            AUDITORIUM_NAME: {type: Sequelize.STRING, allowNull: false},
            AUDITORIUM_CAPACITY: {type: Sequelize.INTEGER, allowNull: false},
            AUDITORIUM_TYPE: {
                type: Sequelize.STRING, allowNull: false,
                references: {model: AUDITORIUM_TYPE, key: 'AUDITORIUM_TYPE'}
            }
        },
        {
            scopes: {
                auditoriumsgt60: {
                    where: {AUDITORIUM_CAPACITY: {[Sequelize.Op.gt]: 60}}
                }
            },
            sequelize, modelName: 'AUDITORIUM', tableName: 'AUDITORIUM', timestamps: false
        }
    )
    FACULTY.hasMany(PULPIT, {as: 'faculty_pulpits', foreignKey: 'FACULTY', sourceKey: 'FACULTY'});
    TEACHER.belongsTo(PULPIT, {as: 'faculty_pulpits', foreignKey: 'PULPIT', sourceKey: 'PULPIT'});
    PULPIT.hasMany(TEACHER, {as: 'pulpit_teachers', foreignKey: 'PULPIT', sourceKey: 'PULPIT'});
};

ORM = (s) => {
    internalORM(s);
    return {FACULTY, PULPIT, TEACHER, SUBJECT, AUDITORIUM_TYPE, AUDITORIUM};
}

ORM(sequelize);

sequelize.authenticate()
    .then(() => {
        console.log('Соединение с базой данных установлено');
    })
    .then(() => {
        return sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED})
            .then(t => {
                return AUDITORIUM.update({AUDITORIUM_CAPACITY: 0}, {
                    where: {AUDITORIUM: {[Sequelize.Op.ne]: "null"}},
                    transaction: t
                })
                    .then((r) => {
                        setTimeout(() => {
                            return t.rollback()
                        }, 10000);
                    })
                    .catch((e) => {
                        console.error("--rollback", e.name, e.message);
                        return t.rollback();
                    });
            })
    })
    .catch(err => {
        console.log('Ошибка при соединении с базой данных', err.message);
    });


let reqestHandler = (req, res) => {
    switch (req.method) {
        case 'GET':
            DO_GET(req, res);
            break;
        case 'POST':
            DO_POST(req, res);
            break;
        case 'PUT':
            DO_PUT(req, res);
            break;
        case 'DELETE':
            DO_DELETE(req, res);
            break;
        default:
            HTTP405(req, res);
            break;
    }
};


let DO_GET = (req, res) => {
    let table;
    let p = req.url;
    switch ('/' + GET_PART_FROM_URL(p, 1)) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(fs.readFileSync('./index.html'));
            break;
        case '/api':
            switch (GET_PART_FROM_URL(p, 2)) {
                case 'faculties':
                    table = FACULTY;
                    break;
                case 'pulpits':
                    table = PULPIT;
                    break;
                case 'subjects':
                    table = SUBJECT;
                    break;
                case 'auditoriumstypes':
                    table = AUDITORIUM_TYPE;
                    break;
                case 'auditoriums':
                    table = AUDITORIUM;
                    break;
                case 'teachers':
                    table = TEACHER;
                    break;
                case 'auditoriumsgt60':
                    table = AUDITORIUM;
                    break;
                default:
                    HTTP404(req, res);
                    break;
            }
            if (table == FACULTY) {
                switch (GET_PART_FROM_URL(p, 4)) {
                    case 'pulpits':
                        table.findAll({
                            where: {
                                FACULTY: GET_PART_FROM_URL(p, 3)
                            },
                            include: [
                                {model: PULPIT, as: 'faculty_pulpits', required: true}
                            ]
                        })
                            .then(p => {
                                p.forEach(elf => {
                                    console.log(elf.dataValues.FACULTY, elf.dataValues.FACULTY_NAME);
                                    elf.dataValues.faculty_pulpits.forEach(elp => {
                                        console.log('--', elp.dataValues.PULPIT, elp.dataValues.PULPIT_NAME);
                                    });
                                });
                            });
                        res.end();
                        break;
                    case 'teachers':
                        table.findAll({
                            where: {
                                FACULTY: GET_PART_FROM_URL(p, 3)
                            },
                            include: [
                                {model: PULPIT, as: 'faculty_pulpits', required: true,
                                    include: [
                                        {model: TEACHER, as: 'pulpit_teachers', required: true}
                                    ]}
                            ],

                        })
                            .then(p => {
                                p.forEach(elf => {
                                    console.log(elf.dataValues.FACULTY, elf.dataValues.FACULTY_NAME);
                                    elf.dataValues.faculty_pulpits.forEach(elp => {
                                        console.log('--', elp.dataValues.PULPIT, elp.dataValues.PULPIT_NAME);
                                        elp.dataValues.pulpit_teachers.forEach(elt => {
                                            console.log('----', elt.dataValues.TEACHER, elt.dataValues.TEACHER_NAME);
                                        })
                                    });
                                });
                            });
                        break;
                    default:
                        table.findAll().then(records => {
                            res.end(JSON.stringify(records));
                        }).catch(error => {
                            res.statusCode = 400;
                            res.end(JSON.stringify({error: String(error)}));
                        });
                }
            } else if (GET_PART_FROM_URL(p, 2) == 'auditoriumsgt60') {
                table.scope('auditoriumsgt60').findAll().then(records => res.end(JSON.stringify(records)))

            } else {
                table.findAll().then(records => {
                    res.end(JSON.stringify(records));
                }).catch(error => {
                    res.statusCode = 400;
                    res.end(JSON.stringify({error: String(error)}));
                });
            }
            break;

        default:
            HTTP404(req, res);
            break;
    }
}

let DO_POST = (req, res) => {
    let p = req.url;
    switch ('/' + GET_PART_FROM_URL(p, 1)) {
        case '/api':
            let body = ' ';
            req.on('data', chunk => {
                body = chunk.toString();
                body = JSON.parse(body);
            });
            req.on('end', async () => {
                switch (GET_PART_FROM_URL(p, 2)) {
                    case 'faculties':
                        FACULTY.create({
                            FACULTY: body.FACULTY,
                            FACULTY_NAME: body.FACULTY_NAME
                        }).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'pulpits':
                        PULPIT.create({
                            PULPIT: body.PULPIT,
                            PULPIT_NAME: body.PULPIT_NAME,
                            FACULTY: body.FACULTY
                        }).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'subjects':
                        SUBJECT.create({
                            SUBJECT: body.SUBJECT,
                            SUBJECT_NAME: body.SUBJECT_NAME,
                            PULPIT: body.PULPIT
                        }).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'auditoriumstypes':
                        AUDITORIUM_TYPE.create({
                            AUDITORIUM_TYPE: body.AUDITORIUM_TYPE,
                            AUDITORIUM_TYPENAME: body.AUDITORIUM_TYPENAME
                        }).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'auditoriums':
                        AUDITORIUM.create({
                            AUDITORIUM: body.AUDITORIUM,
                            AUDITORIUM_NAME: body.AUDITORIUM_NAME,
                            AUDITORIUM_CAPACITY: body.AUDITORIUM_CAPACITY,
                            AUDITORIUM_TYPE: body.AUDITORIUM_TYPE
                        }).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'teachers':
                        TEACHER.create({
                            TEACHER: body.TEACHER,
                            TEACHER_NAME: body.TEACHER_NAME,
                            PULPIT: body.PULPIT
                        }).catch(err => console.log('Error: ', err.message));
                        break;
                    default:
                        HTTP404(req, res);
                        break;
                }

                res.end();
            });


            break;

        default:
            HTTP404(req, res);
            break;
    }
}

let DO_PUT = (req, res) => {
    let p = req.url;
    switch ('/' + GET_PART_FROM_URL(p, 1)) {
        case '/api':
            let body = ' ';
            req.on('data', chunk => {
                body = chunk.toString();
                body = JSON.parse(body);
            });
            req.on('end', async () => {
                switch (GET_PART_FROM_URL(p, 2)) {
                    case 'faculties':
                        FACULTY.update({FACULTY_NAME: body.FACULTY_NAME},
                            {where: {FACULTY: body.FACULTY}}).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'pulpits':
                        PULPIT.update({PULPIT_NAME: body.PULPIT_NAME, FACULTY: body.FACULTY},
                            {where: {PULPIT: body.PULPIT}}).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'subjects':
                        SUBJECT.update({SUBJECT_NAME: body.SUBJECT_NAME, PULPIT: body.PULPIT},
                            {where: {SUBJECT: body.SUBJECT}}).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'auditoriumstypes':
                        AUDITORIUM_TYPE.update({AUDITORIUM_TYPENAME: body.AUDITORIUM_TYPENAME},
                            {where: {AUDITORIUM_TYPE: body.AUDITORIUM_TYPE}}).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'auditoriums':
                        AUDITORIUM.update({
                                AUDITORIUM_NAME: body.AUDITORIUM_NAME,
                                AUDITORIUM_CAPACITY: body.AUDITORIUM_CAPACITY,
                                AUDITORIUM_TYPE: body.AUDITORIUM_TYPE
                            },
                            {where: {AUDITORIUM: body.AUDITORIUM}}).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'teachers':
                        TEACHER.update({TEACHER_NAME: body.TEACHER_NAME, PULPIT: body.PULPIT},
                            {where: {TEACHER: body.TEACHER}}).catch(err => console.log('Error: ', err.message));
                        break;
                    default:
                        HTTP404(req, res);
                        break;
                }
                res.end();
            });
            break;
        default:
            HTTP404(req, res);
            break;
    }
};

let DO_DELETE = (req, res) => {
    let p = req.url;
    switch ('/' + GET_PART_FROM_URL(p, 1)) {
        case '/api':
            let body = ' ';
            req.on('data', chunk => {
                body = chunk.toString();
                body = JSON.parse(body);
            });
            req.on('end', async () => {
                switch (GET_PART_FROM_URL(p, 2)) {
                    case 'faculties':
                        FACULTY.destroy({where: {FACULTY: GET_PART_FROM_URL(p, 3)}}).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'pulpits':
                        console.log(body);
                        PULPIT.destroy({where: {PULPIT: GET_PART_FROM_URL(p, 3)}}).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'subjects':
                        SUBJECT.destroy({where: {SUBJECT: GET_PART_FROM_URL(p, 3)}}).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'auditoriumstypes':
                        AUDITORIUM_TYPE.destroy({where: {AUDITORIUM_TYPE: GET_PART_FROM_URL(p, 3)}}).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'auditoriums':
                        AUDITORIUM.destroy({where: {AUDITORIUM: GET_PART_FROM_URL(p, 3)}}).catch(err => console.log('Error: ', err.message));
                        break;
                    case 'teachers':
                        TEACHER.destroy({where: {TEACHER: GET_PART_FROM_URL(p, 3)}}).catch(err => console.log('Error: ', err.message));
                        break;
                    default:
                        HTTP404(req, res);
                        break;
                }
                res.end();
            });
            break;
        default:
            HTTP404(req, res);
            break;
    }
};

let HTTP404 = (req, res) => {
    console.log(`${req.method}: ${req.url}, HTTP status 404`);
    res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(`"error" : "${req.method}: ${req.url}, HTTP status 404"`);
}

let HTTP405 = (req, res) => {
    console.log(`${req.method}: ${req.url}, HTTP status 405`);
    res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(`Error" : "${req.method}: ${req.url}, HTTP status 405"`);
}

function GET_PART_FROM_URL(url, index) {
    let i = 0;
    let curr_url = ' ';
    i--;
    decodeURI(url).split('/').forEach(e => {
        i++;
        if (i == index) {
            curr_url = e;
            return;
        }
    });
    return curr_url ? curr_url : '';
}

const server = http.createServer().listen(3000, () => {
    console.log(`Listening on http://localhost:3000`);
})
    .on('error', (e) => {
        console.log(`error: ${e.code} ${e.message}`)
    })
    .on('request', reqestHandler);
