const Users = require('./Users.json');

const getCredential = (user)=>{
    let u = Users.find((e)=>{return e.user.toUpperCase() == user.toUpperCase(); });
    return u;
};

const verPassword = (pass1, pass2)=>{return pass1 == pass2;};

module.exports = {
    getCredential:getCredential,
    verPassword:verPassword
};