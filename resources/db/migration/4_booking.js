exports.up = async (knex) => {
  return knex.schema.raw(`
    CREATE TABLE booking (
      id SERIAL PRIMARY KEY,
      seat_count INTEGER,
      email TEXT,
      flight_id INTEGER REFERENCES flight(id)
    );
    CREATE INDEX  search_fields_booking ON booking
    (
      email,
      flight_id
    );
  `);
};

exports.down = async (knex) => {
  return knex.schema.dropTable('booking');
};
