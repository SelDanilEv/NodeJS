const Commits = require("../models/index").commits;

module.exports = {
    AddCommits: async (id, json) => {
        return await Commits.create({
            repoId: id,
            message: json["message"],
        });
    },
    PutCommits: async (id_repos, id_commit, json) => {
        return await Commits.update(
            {
                repoId: id_repos,
                message: json["message"],
            },
            {where: {id: id_commit}}
        );
    },
    DeleteCommits: async (id_repos, id_commit) => {
        return await Commits.destroy({
            where: {
                id: id_commit,
                repoId: id_repos,
            },
        });
    },
    GetByIdRepos: async (id_repos) => {
        return await Commits.findAll({
            where: {repoId: id_repos},
            raw: true,
        });
    },
    GetByIdReposAndCommits: async (id_repos, id_commit) => {
        return await Commits.findAll({
            where: {repoId: id_repos, id: id_commit},
            raw: true,
        });
    },
};
