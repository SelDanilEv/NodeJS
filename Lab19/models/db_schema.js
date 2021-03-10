const Sequelize = require('sequelize');
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
        {sequelize, modelName: 'FACULTY', tableName: 'FACULTY', timestamps: false}
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
        {sequelize, modelName: 'AUDITORIUM', tableName: 'AUDITORIUM', timestamps: false}
    )

    FACULTY.hasMany(PULPIT, {as: 'faculty_pulpits', foreignKey: 'FACULTY', sourceKey: 'FACULTY'});
    TEACHER.belongsTo(PULPIT, {as: 'pulpit_teachers', foreignKey: 'PULPIT', sourceKey: 'PULPIT'});
    PULPIT.hasMany(TEACHER, {as: 'pulpit_teachers', foreignKey: 'PULPIT', sourceKey: 'PULPIT'});
    PULPIT.belongsTo(FACULTY,{as: 'faculty_pulpits', foreignKey: 'FACULTY', targetKey: 'FACULTY'});
};



exports.ORM = (s) => {
    internalORM(s);
    return {FACULTY, PULPIT, TEACHER, SUBJECT, AUDITORIUM_TYPE, AUDITORIUM};
}
