const AUTHORIZED_USERS = [
  {
    username: 'raclette',
    password: 'tartiflette',
  }
];

function checkCredentials(username, password) {
  // for the sake of simplicity
  return AUTHORIZED_USERS.some(user => user.username === username && user.password === password);
}

module.exports = {
  checkCredentials,
};