exports.up = async (knex) => {
  return knex.schema.raw(`
    CREATE TABLE space_center (
      id SERIAL PRIMARY KEY,
      uid VARCHAR (36),
      name TEXT,
      description TEXT,
      latitude NUMERIC,
      longitude NUMERIC,
      planet_id INTEGER REFERENCES planet(id)
    );
  `);
};

exports.down = async (knex) => {
  return knex.schema.dropTable('space_center');
};