exports.up = async (knex) => {
  return knex.schema.raw(`
    CREATE TABLE flight (
      id SERIAL PRIMARY KEY,
      code TEXT,
      departure_at TIMESTAMP,
      seat_count INTEGER,
      launch_site INTEGER REFERENCES space_center(id),
      landing_site INTEGER REFERENCES space_center(id)
    );
    CREATE INDEX  search_fields_flight ON flight
    (
      id,
      ((departure_at::DATE)),
      seat_count,
      launch_site,
      landing_site
    );
  `);
};

exports.down = async (knex) => {
  return knex.schema.dropTable('flight');
};