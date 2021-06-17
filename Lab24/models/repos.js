module.exports = (Sequelize, sequelize) => {
    return sequelize.define(
        "Repos",
        {
            id: {
                type: Sequelize.INTEGER,
                allowNULL: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {type: Sequelize.STRING, allowNULL: false},
        },
        {sequelize, modelName: "Repos", tableName: "repos"}
    );
};
