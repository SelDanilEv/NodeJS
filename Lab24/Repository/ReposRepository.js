const repos = require("../models/index").repos;

const Repos = require("../Classes/Repos");

module.exports = {
    AddRepos: async (json) => {
        return await repos.create({
            name: json["name"],
            authorId: json["authorId"],
        });
    },
    GetAll: async () => {
        return await repos.findAll({raw: true});
    },
    FindByID: async (json) => {
        return await repos.findAll({
            where: {id: json},
            raw: true,
        });
    },
    Find: async (id) => {
        return await repos.findOne({
            where: {id: id},
            raw: true,
            nest: true
        }).then(model => {
                let repos = new Repos({authorId: Number(model["authorId"])});
                repos.authorId = model.authorId;
                return repos;
            }
        );
    },
    PutRepos: async (id, json) => {
        return await repos.update(
            {
                name: json["name"],
                authorId: json["authorId"],
            },
            {where: {id: id}}
        )
    },
    DeleteRepos: async (id) => {
        return await repos.destroy({
            where: {
                id: id,
            },
        });
    },
};
