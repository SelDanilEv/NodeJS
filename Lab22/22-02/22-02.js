const UserService = require("./users");
const express = require("express"),
  app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jwt = require("./jwt");
const config = require("./config");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/Register", (req, res) => {
  res.sendFile(__dirname + "/Register.html");
});

app.post("/login", urlencodedParser, async (req, res) => {
  let resultFind = await UserService.getCredential({
    user: req.body.username,
  });
  if (!resultFind) res.redirect("/login");
  if (resultFind["password"] != req.body.password)
    res.redirect("/login");
  else {
    try {
      res.cookie(
          config.jwt.tokens.refresh.type,
          jwt.generateRefreshToken(req.body.username),
          config.refreshOptions,
      );
      res.cookie(
          config.jwt.tokens.access.type,
          jwt.generateAccessToken(req.body.username),
          config.accessOptions,
      );
    }
    catch (e){
      console.log(e);
    }
    res.redirect("/resource");
  }
});

app.get("/resource", jwt.CheckJwt, (req, res) => {
  res.send(
    ` resource  username =  ${req.body["user"]}`
  );
});

app.post("/Register", urlencodedParser, (req, res) => {
  try {
    UserService.addUser({
      user: req.body.username,
      password: req.body.password,
    });
    return res.redirect("/login");
  } catch {
    return res.sendStatus(404);
  }
});
app.get("/logout", (req, res) => {

  res.clearCookie(config.jwt.tokens.refresh.type);
  res.clearCookie(config.jwt.tokens.access.type);
  res.redirect("/login");
});

app.get("/refresh-token", jwt.CheckJwtRefresh, (req, res) => {
  res.clearCookie(config.jwt.tokens.refresh.type);
  res.clearCookie(config.jwt.tokens.access.type);
  res.cookie(
    config.jwt.tokens.refresh.type,
    jwt.generateRefreshToken(req.body["user"]),
    config.refreshOptions
  );
  res.cookie(
    config.jwt.tokens.access.type,
    jwt.generateAccessToken(req.body["user"]),
    config.accessOptions
  );
  res.redirect("/resource");
});

app.use(function (request, response) {
  response.sendStatus(404);
});

app.listen(3000, () => console.log('http://localhost:3000/login'));

