const app = require('express')();
const passport = require('passport');
const DigestStrategy = require('passport-http').DigestStrategy;
const {getCredential, verPassword} = require('./21-01m');
const session = require('express-session')(
    {
        resave: false,
        saveUninitialized: false,
        secret: '12345678'
    }
);

passport.use(new DigestStrategy({qop: 'auth'}, (user, done) => {
    let rc = null;
    let cr = getCredential(user);
    if (!cr) rc = done(null, false);
    else rc = done(null, cr.user, cr.password);
    return rc;
}, (params, done) => {
    console.log('params = ', params);
    done(null, true);
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
    }, passport.authenticate('digest', {session: false})
).get('/login', (req, res, next) => {
    console.log('get-2');
    res.redirect('/resource');
}).get('/resource', (req, res, next) => {
        if (req.session.logout == false && req.headers['authorization']) {
            console.log('resource');
            res.send('resource');
        } else {
            res.redirect('/login')
        }
    }
).get('/logout', (req, res)=>{
    console.log('logout');
    req.session.logout = true;
    res.redirect('/login');
});

app.get('*', function(req, res){
    res.status(404).send('ERROR 404: not found ' + req.url);
});

app.listen(3000, () => console.log('http://localhost:3000/login'));