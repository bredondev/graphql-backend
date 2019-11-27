const config = require('../../knexfile.js')[process.env.NODE_ENV];

module.exports = require('knex')(config);