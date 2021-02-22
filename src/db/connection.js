const config = require('../../resources/db/knexfile')[process.env.NODE_ENV];

module.exports = require('knex')(config);