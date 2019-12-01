exports.up = async (knex) => {
  return knex.schema.raw(`
    CREATE TABLE flight (
      id SERIAL PRIMARY KEY,
      code TEXT,
      departure_at TIMESTAMP,
      seat_count INTEGER,
      launch_site_id INTEGER REFERENCES space_center(id),
      landing_site_id INTEGER REFERENCES space_center(id)
    );
    CREATE INDEX  search_fields_flight ON flight
    (
      ((departure_at::DATE)),
      seat_count,
      launch_site_id,
      landing_site_id
    );
  `);
};

exports.down = async (knex) => {
  return knex.schema.dropTable('flight');
};