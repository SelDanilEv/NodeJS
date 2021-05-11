module.exports = (Sequelize, sequelize) => {
    return sequelize.define(
        "commits",
        {
            id: {
                type: Sequelize.INTEGER,
                allowNULL: false,
                primaryKey: true,
                autoIncrement: true,
            },
            message: {type: Sequelize.STRING},
        },
        {sequelize, modelName: "commits", tableName: "commits"}
    );
};
