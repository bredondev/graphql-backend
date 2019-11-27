exports.up = async (knex) => {
  return knex.schema.raw(`
    CREATE TABLE booking (
      id SERIAL PRIMARY KEY,
      seat_count INTEGER,
      email TEXT,
      flight_id INTEGER REFERENCES flight(id)
    );
  `);
};

exports.down = async (knex) => {
  return knex.schema.dropTable('booking');
};
