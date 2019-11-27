exports.up = async (knex) => {
  return knex.schema.raw(`
    CREATE TABLE flight (
      id SERIAL PRIMARY KEY,
      code TEXT,
      departure_at TEXT,
      seat_count INTEGER,
      launch_site INTEGER REFERENCES space_center(id),
      landing_site INTEGER REFERENCES space_center(id)
    );
  `);
};

exports.down = async (knex) => {
  return knex.schema.dropTable('flight');
};