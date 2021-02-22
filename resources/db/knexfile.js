// Update with your config settings.
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      database: 'spacex',
      user: 'elon',
      password: 'raclette',
      port: '5432',
    },
    migrations: {
      directory: './migration',
    },
    seeds: {
      directory: './seeds',
    },
  },
  staging: {
    client: 'pg',
    connection: {
      host: 'db',
      database: 'spacex',
      user: 'elon',
      password: 'raclette',
      port: '5432',
    },
    migrations: {
      directory: './migration',
    },
    seeds: {
      directory: './seeds',
    },
  }
};
