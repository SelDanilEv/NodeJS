const UserRepository = require("./Repository/UsersRepository");
const ReposRepository = require("./Repository/ReposRepository");
const CommitsRepository = require("./Repository/CommitsRepository");
const {Ability, AbilityBuilder, ForbiddenError} = require("casl");
const express = require("express"),
    app = express();
const bodyParser = require("body-parser");
const expressjwt = require("express-jwt");
const jwtService = require("./jwt");
let cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const commits = require("./models/commits");
const jsonParser = express.json();
const secret = "123456";
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
const Repos = require("./Classes/Repos");
const Commits = require("./Classes/Commits");
app.use(
    expressjwt({
        secret,
        algorithms: ["HS256"],
        getToken: (req, res) => {
            let GUEST_TOKEN = jwt.sign({role: "guest"}, secret);
            console.log("Guest  " + GUEST_TOKEN);
            if (req.cookies["jwt"] && req.cookies["jwt"].split(" ")[0] === "Bearer") {
                return req.cookies["jwt"].split(" ")[1];
            } else {
                return GUEST_TOKEN;
            }
        },
    })
);
app.use(async (req, res, next) => {
    //console.log(req);
    const {rules, can, cannot} = AbilityBuilder.extract();
    const role = req.user.role;
    console.log("ROLE   " + role);
    console.log("id  " + req.user["id"]);
    if (role === "guest") {
        can("read", ["ability", "Repos", "Commits"]);
    }
    if (role === "user") {
        can("read", ["ability", "Repos", "Commits"]);
        can(["update", "delete", "create"], ["Repos", "Commits"], {
            authorId: req.user["id"],
        });
    }
    if (role === "admin") {
        can("read", "all");
        can(["update", "delete"], ["Repos", "Commits"]);
    }
    req.ability = new Ability(rules);
    next();
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});
app.get("/Register", (req, res) => {
    res.sendFile(__dirname + "/Register.html");
});
app.get("/repos", (req, res) => {
    res.sendFile(__dirname + "/Repos.html");
});
app.get("/commits", (req, res) => {
    res.sendFile(__dirname + "/Commits.html");
});

app.post("/login", async (req, res) => {
    let result = await jwtService.generateToken(req.body);
    if (result !== null) {
        res.cookie("jwt", "Bearer " + result["token"]);
        return res.redirect('/repos');
    } else {
        return res.redirect("/login");
    }
});
app.post("/Register", async (req, res) => {
    try {
        let resultFind = await UserRepository.FindByUsername({
            username: req.body.username,
        });
        if (resultFind.length === 0) {
            UserRepository.AddUsers({
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
                email: req.body.email,
            });
            return res.redirect('/login');
        } else {
            return res
                .status(400)
                .send(JSON.stringify({ERROR: "check input data"}));
        }
    } catch (e) {
        return res.sendStatus(404);
    }
});
app.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/login");
});

app.get("/ability", (req, res) => {
    try {
        // console.log(req.ability.rules);
        // console.log(req.ability.aliases);
        // req.ability.throwUnlessCan("read", req.ability.rules);
        console.log(req.ability);
        res.status(200).send(req.ability.rules);
    } catch (err) {
        res.status(404).send(JSON.stringify({ERROR: err.message}));
    }
});
app.get("/api/user", (req, res) => {
    req.ability.throwUnlessCan("read");
    UserRepository.GetAll()
        .then((users) => {
            req.ability.throwUnlessCan("read", users);
            return res.json(users);
        })
        .catch((err) =>
            res.status(404).send(JSON.stringify({ERROR: err.message}))
        );
});
app.get("/api/user/:ID", (req, res) => {
    UserRepository.FindByID(req.params["ID"])
        .then((user) => {
            const {password, ...userWithoutPassword} = user[0];
            req.ability.throwUnlessCan("read", user);
            return res.json(userWithoutPassword);
        })
        .catch((err) =>
            res.status(404).send(JSON.stringify({ERROR: err.message}))
        );
});

app.get("/api/repos", (req, res) => {
    ReposRepository.GetAll()
        .then((users) => {
            return res.json(users);
        })
        .catch((err) =>
            res.status(404).send(JSON.stringify({ERROR: err.message}))
        );
});
app.get("/api/repos/:ID", (req, res) => {
    ReposRepository.FindByID(req.params["ID"])
        .then((users) => {
            return res.json(users);
        })
        .catch((err) =>
            res.status(404).send(JSON.stringify({ERROR: err.message}))
        );
});
app.post("/api/repos", async (req, res) => {
    try {
        // console.log(req.ability.throwUnlessCan("create", "post"));
        let repos = new Repos({authorId: Number(req.body["authorId"])});
        req.ability.throwUnlessCan("create", repos);
        let resultAdd = await ReposRepository.AddRepos(req.body);
        if (resultAdd.length !== 0) {
            return res.redirect('/repos');
        } else {
            return res
                .status(404)
                .send(JSON.stringify({ERROR: "check input data"}));
        }
    } catch (err) {
        return res.status(404).send(JSON.stringify({ERROR: err.message}));
    }
});
app.put("/api/repos/:ID", jsonParser, async (req, res) => {
    try {
        let resultFind = await ReposRepository.Find(req.params["ID"]);
        if (resultFind == null) {
            return res
                .status(403)
                .send(JSON.stringify({ERROR: "403 Forbidden Error"}));
        }
        let repos = new Repos({authorId: Number(resultFind["authorId"])});
        req.ability.throwUnlessCan("update", repos);
        let resultPut = await ReposRepository.PutRepos(req.params["ID"], req.body);
        if (resultPut == 0) {
            return res
                .status(404)
                .send(JSON.stringify({ERROR: "check input data"}));
        } else {
            return res.send("OK");
        }
    } catch (err) {
        return res.status(404).send(JSON.stringify({ERROR: err.message}));
    }
});

app.post("/api/repos/:ID/commits", jsonParser, async (req, res) => {
    try {
        let resultFind = await ReposRepository.Find(req.params["ID"]);
        if (resultFind == null) {
            return res
                .status(403)
                .send(JSON.stringify({ERROR: "403 Forbidden Error"}));
        }
        let commits = new Commits({authorId: Number(resultFind["authorId"])});
        req.ability.throwUnlessCan("create", commits);
        let resultAdd = await CommitsRepository.AddCommits(
            req.params["ID"],
            req.body
        );
        if (resultAdd.length !== 0) {
            return res.send("OK");
        } else {
            return res
                .status(404)
                .send(JSON.stringify({ERROR: "check input data"}));
        }
    } catch (err) {
        return res.status(404).send(JSON.stringify({ERROR: err.message}));
    }
});
app.put("/api/repos/:ID/commits/:IDcommit", jsonParser, async (req, res) => {
    try {
        let resultFind = await ReposRepository.Find(req.params["ID"]);
        if (resultFind == null) {
            return res
                .status(403)
                .send(JSON.stringify({ERROR: "403 Forbidden Error"}));
        }
        let commits = new Commits({authorId: Number(resultFind["authorId"])});
        req.ability.throwUnlessCan("update", commits);
        let resultPut = await CommitsRepository.PutCommits(
            req.params["ID"],
            req.params["IDcommit"],
            req.body
        );
        if (resultPut[0] !== 0) {
            return res.send("OK");
        } else {
            return res
                .status(404)
                .send(JSON.stringify({ERROR: "check input data"}));
        }
    } catch (err) {
        return res.status(404).send(JSON.stringify({ERROR: err.message}));
    }
});
app.delete("/api/repos/:ID/commits/:IDcommit", async (req, res) => {
    try {
        let resultFind = await ReposRepository.Find(req.params["ID"]);
        if (resultFind == null) {
            return res
                .status(403)
                .send(JSON.stringify({ERROR: "403 Forbidden Error"}));
        }
        let commits = new Commits({authorId: Number(resultFind["authorId"])});
        req.ability.throwUnlessCan("delete", commits);
        let resultDelete = await CommitsRepository.DeleteCommits(
            req.params["ID"],
            req.params["IDcommit"]
        );
        if (resultDelete == 0) {
            return res
                .status(404)
                .send(JSON.stringify({ERROR: "check input data"}));
        } else {
            return res.send("OK");
        }
    } catch (err) {
        return res.status(404).send(JSON.stringify({ERROR: err.message}));
    }
});
app.get("/api/repos/:ID/commits", (req, res) => {
    CommitsRepository.GetByIdRepos(req.params["ID"])
        .then((result) => {
            return res.json(result);
        })
        .catch((err) =>
            res.status(404).send(JSON.stringify({ERROR: err.message}))
        );
});
app.get("/api/repos/:ID_repos/commits/:ID_commit", (req, res) => {
    CommitsRepository.GetByIdReposAndCommits(
        req.params["ID_repos"],
        req.params["ID_commit"]
    )
        .then((result) => {
            // (user);
            // const { password, ...userWithoutPassword } = user[0];
            // req.ability.throwUnlessCan("read", user);
            // res.json(userWithoutPassword);
            return res.json(result);
        })
        .catch((err) =>
            res.status(404).send(JSON.stringify({ERROR: err.message}))
        );
});


app.delete("/api/repos/:ID", async (req, res) => {
    try {
        let resultFind = await ReposRepository.Find(req.params["ID"]);
        if (resultFind == null) {
            return res
                .status(403)
                .send(JSON.stringify({ERROR: "403 Forbidden Error"}));
        }
        let repos = new Repos({authorId: Number(resultFind["authorId"])});
        req.ability.throwUnlessCan("delete", repos);
        let resultDelete = await ReposRepository.DeleteRepos(req.params["ID"]);
        if (resultDelete == 0) {
            return res
                .status(404)
                .send(JSON.stringify({ERROR: "check input data"}));
        } else {
            return res.send("OK");
        }
    } catch (err) {
        return res.status(404).send(JSON.stringify({ERROR: err.message}));
    }
});


app.use(function (request, response) {
    response.sendStatus(404);
});

app.listen(3000, () => console.log('http://localhost:3000/login'));

