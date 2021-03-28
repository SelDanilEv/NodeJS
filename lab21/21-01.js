const app = require('express')();
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const {getCredential, verPassword} = require('./21-01m');
const session = require('express-session')(
    {
        resave: false,
        saveUninitialized: false,
        secret: '12345678'
    }
);

passport.use(new BasicStrategy((user, password, done) => {
    console.log('passport.use', user, password);
    let rc = null;
    let cr = getCredential(user);
    if (!cr) rc = done(null, false, {message: 'incorrect username'});
    else if (!verPassword(cr.password, password)) rc = done(null, false, {message: 'incorrect password'});
    else rc = done(null, user);
    return rc;
}));

passport.serializeUser((user, done) => {
    console.log('serialize', user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('deserialize', user);
    done(null, user);
});

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res, next) => {
        console.log('preAuth');
        if (req.session.logout && req.headers['authorization']) {
            req.session.logout = false;
            delete req.headers['authorization'];
        }
        next();
    },
    passport.authenticate('basic'), (req, res, next) => {
        next();
    }
).get('/login', (req, res, next) => {
    console.log('redirect to resource');
    res.redirect('/resource');
}).get('/resource', (req, res, next) => {
        if (req.session.logout == false && req.headers['authorization']) {
            console.log('resource');
            res.send('resource');
        } else {
            res.redirect('/login')
        }
    }
).get('/logout', function (req, res) {
    console.log('logout');
    req.session.logout = true;
    res.redirect('/login');
});

app.get('*', function(req, res){
    res.status(404).send('ERROR 404: not found ' + req.url);
});

app.listen(3000, () => console.log('http://localhost:3000/login'));