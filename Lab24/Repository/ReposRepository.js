const Repos = require("../models/index").repos;

module.exports = {
    AddRepos: async (json) => {
        return await Repos.create({
            name: json["name"],
            authorId: json["authorId"],
        });
    },
    GetAll: async () => {
        return await Repos.findAll({raw: true});
    },
    FindByID: async (json) => {
        return await Repos.findAll({
            where: {id: json},
            raw: true,
        });
    },
    Find: async (id) => {
        return await Repos.findOne({
            where: {id: id},
            raw: true,
        });
    },
    PutRepos: async (id, json) => {
        return await Repos.update(
            {
                name: json["name"],
                authorId: json["authorId"],
            },
            {where: {id: id}}
        );
    },
    DeleteRepos: async (id) => {
        return await Repos.destroy({
            where: {
                id: id,
            },
        });
    },
};
