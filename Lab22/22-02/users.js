const Users = require('../../files/Users.json');

const getCredential = (user) => {
  return Users.find((e) => {
    console.log('Is user ver login ' + (e.user.toUpperCase() == user.user.toUpperCase()));
    return e.user.toUpperCase() == user.user.toUpperCase();
  });
};

const addUser = (user) => {
  return Users.push(user);
};

const verPassword = (pass1, pass2) => {
  console.log('Is user ver password ' + (pass1 == pass2));
  return pass1 == pass2;
};

module.exports = {
  getCredential: getCredential,
  verPassword: verPassword,
  addUser: addUser
};


module.exports.Users = Users;
