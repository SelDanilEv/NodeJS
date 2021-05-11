const jwt = require("jsonwebtoken");
const secret = "123456";
const UserRepository = require("./Repository/UsersRepository");

module.exports = {
    generateToken: async (json) => {
        let resultFind = await UserRepository.FindByUsername({
            username: json["username"],
        });
        if (json["password"] == resultFind[0]["password"]) {
            const payload = {
                username: resultFind[0]["username"],
                id: resultFind[0]["id"],
                role: resultFind[0]["role"],
            };
            const token = jwt.sign(payload, secret);
            const {password, ...userWithoutPassword} = resultFind[0];
            return {...userWithoutPassword, token};
        } else {
            return null;
        }
    },
    generateTokenGuest: async () => {
        const payload = {
            role: "Guest",
        };
        const token = jwt.sign(payload, secret);
        console.log("token  " + token);
        return token;
    },
    CheckJwt: async (req, res, next) => {
        console.log(req.cookies["jwt"]);
        await jwt
            .verify(
                req.cookies["jwt"].split(" ")[1],
                secret,
                async (err, decoded) => {
                    console.log(decoded["username"]);
                    let result = await UserRepository.FindByUsername({
                        username: decoded["username"],
                    });
                    if (result.length == 1) {
                        next();
                    }
                }
            )
            .catch((e) => {
                return res
                    .status(401)
                    .send(JSON.stringify({ERROR: "token is not valid"}));
            });
    },
};
