const {secret, tokens} = require("./config").jwt;
const jwt = require("jsonwebtoken");
const UserService = require("./users.js");
const blackList = require("./black-list");

module.exports = {
    generateAccessToken: (username) => {
        const payload = {
            username: username,
            type: tokens.access.type,
        };
        const options = {expiresIn: tokens.access.expiresIn};
        return jwt.sign(payload, secret, options);
    },
    generateRefreshToken: (username) => {
        const payload = {
            username: username,
            type: tokens.refresh.type,
        };
        const options = {expiresIn: tokens.refresh.expiresIn};
        return jwt.sign(payload, secret, options);
    },
    CheckJwt: async (req, res, next) => {
        await jwt
            .verify(req.cookies[tokens.access.type], secret, async (err, decoded) => {
                if (decoded["type"] != tokens.access.type)
                    return res
                        .status(401)
                        .send(JSON.stringify({ERROR: "token is not valid"}));
                let result = await UserService.getCredential({
                    user: decoded["username"],
                });
                if (result) {
                    req.body = result;
                    next();
                } else {
                    return res
                        .status(401)
                        .send(JSON.stringify({ERROR: "token is not valid"}));
                }
            })
            .catch((e) => {
                return res
                    .status(401)
                    .send(JSON.stringify({ERROR: "token is not valid"}));
            });
    },
    CheckJwtRefresh: async (req, res, next) => {
        await jwt
            .verify(
                req.cookies[tokens.refresh.type],
                secret,
                async (err, decoded) => {
                    if (decoded["type"] != tokens.refresh.type)
                        return res
                            .status(401)
                            .send(JSON.stringify({ERROR: "token is not valid1"}));
                    let result = await UserService.getCredential({
                        user: decoded["username"],
                    });
                    if (result) {
                        req.body = result;
                        let resultCHeck = await blackList.CheckBlackList(
                            decoded["username"],
                            req.cookies[tokens.refresh.type]
                        );
                        console.log(`${resultCHeck}   chek`);
                        if (!resultCHeck) {
                            return res
                                .status(401)
                                .send(JSON.stringify({ERROR: "token is not valid2"}));
                        }
                        blackList.AddBlackList(
                            decoded["username"],
                            req.cookies[tokens.refresh.type]
                        );
                        next();
                    } else {
                        return res
                            .status(401)
                            .send(JSON.stringify({ERROR: "token is not valid3"}));
                    }
                }
            )
            .catch((e) => {
                console.log(e);
                return res
                    .status(401)
                    .send(JSON.stringify({ERROR: "token is not valid4"}));
            });
    },
};
