module.exports = (Sequelize, sequelize) => {
    return sequelize.define(
        "users1",
        {
            id: {
                type: Sequelize.INTEGER,
                allowNULL: false,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {type: Sequelize.STRING, allowNULL: false},
            email: {type: Sequelize.STRING},
            password: {type: Sequelize.STRING, allowNULL: false},
            role: {type: Sequelize.STRING, allowNULL: false},
        },
        {sequelize, modelName: "users1", tableName: "users1"}
    );
};
