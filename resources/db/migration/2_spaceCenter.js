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
    CREATE INDEX  search_fields_space_center ON space_center
    (
      id,
      uid,
      planet_id
    );
  `);
};

exports.down = async (knex) => {
  return knex.schema.dropTable('space_center');
};