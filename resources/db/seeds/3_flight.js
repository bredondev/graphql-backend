const crypto = require('crypto');

exports.seed = async(knex) => {
  return knex('flight').insert([
    {
      code: crypto.randomBytes(16).toString('hex'),
      departure_at: '2050-01-01T02:00:00Z',
      seat_count: 10,
      launch_site: 1,
      landing_site: 2,
    },
    {
      code: crypto.randomBytes(16).toString('hex'),
      departure_at: '2049-01-01T02:00:00Z',
      seat_count: 20,
      launch_site: 2,
      landing_site: 3,
    },
    {
      code: crypto.randomBytes(16).toString('hex'),
      departure_at: '2048-01-01T02:00:00Z',
      seat_count: 30,
      launch_site: 3,
      landing_site: 4,
    },
    {
      code: crypto.randomBytes(16).toString('hex'),
      departure_at: '2047-01-01T02:00:00Z',
      seat_count: 40,
      launch_site: 4,
      landing_site: 5,
    },
    {
      code: crypto.randomBytes(16).toString('hex'),
      departure_at: '2046-01-01T02:00:00Z',
      seat_count: 50,
      launch_site: 5,
      landing_site: 6,
    },
  ]);
};
