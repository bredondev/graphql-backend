const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./constants');

function paginateResults({
  page = 1,
  pageSize = 10,
  results,
}) {
  if (!results.length) return [];

  const nbOfPages = Math.ceil(results.length / pageSize);

  if (page > nbOfPages) return [];

  // in case of page or pageSize lower than 1
  const wantedPage = (page < 1 ? 1 : page);
  let wantedPageSize = (pageSize < 1 ? 1 : pageSize);
  wantedPageSize = (wantedPageSize > 100 ? 100 : wantedPageSize);

  return results.slice(
    (wantedPage - 1) * wantedPageSize,
    Math.min(results.length, wantedPage * wantedPageSize)
  );
}

function checkCredentials(username, password) {
  // for the sake of simplicity
  const AUTHORIZED_USERS = [
    {
      username: 'raclette',
      password: 'tartiflette',
    }
  ];
  return AUTHORIZED_USERS.some(user => user.username === username && user.password === password);
}

function getUserFromToken(token) {
  const decodedToken = jwt.verify(token, JWT_SECRET);

  // in case the user has been deleted/banned and his token is still valid
  if (!checkCredentials(decodedToken.data.username, decodedToken.data.password)) {
    throw new Error('Wrong credentials');
  }

  return {
    username: decodedToken.data.username,
    password: decodedToken.data.password
  };
}

module.exports = {
  paginateResults,
  checkCredentials,
  getUserFromToken,
};