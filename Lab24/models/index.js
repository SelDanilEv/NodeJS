const Sequelize = require("sequelize");

const sequelize = new Sequelize("lab_24", "sa", "123qweASD", {
    host: "DEFENDER-SD",
    dialect: "mssql",
    define: {
        timestamps: false,
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    }
});
const users = require("./users")(Sequelize, sequelize);
const repos = require("./repos")(Sequelize, sequelize);
const commits = require("./commits")(Sequelize, sequelize);

users.hasMany(repos, {
    as: "fk_repos_users",
    foreignKey: "authorId",
    onDelete: "CASCADE",
    sourceKey: "id",
});

repos.hasMany(commits, {
    as: "fk_commits_repos",
    foreignKey: "repoId",
    onDelete: "CASCADE",
    sourceKey: "id",
});
module.exports = {
    users: users,
    repos: repos,
    commits: commits,
    sequelize,
    Sequelize,
};
