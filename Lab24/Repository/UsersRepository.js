const Users = require("../models/index").users;

module.exports = {
    AddUsers: async (json) => {
        return await Users.create({
            username: json["username"],
            password: json["password"],
            role: json["role"],
            email: json["email"],
        });
    },
    FindByUsername: async (json) => {
        return await Users.findAll({
            where: {username: json["username"]},
            raw: true,
        });
    },
    GetAll: async () => {
        return await Users.findAll({raw: true});
    },
    FindByID: async (json) => {
        return await Users.findAll({
            where: {id: json},
            raw: true,
        });
    },
    FindByIDOne: async (json) => {
        return await Users.findOne({
            where: {id: json},
            raw: true,
        });
    },
};
