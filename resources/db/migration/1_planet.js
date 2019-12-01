exports.up = async (knex) => {
  return knex.schema.raw(`
    CREATE TABLE planet (
      id SERIAL PRIMARY KEY,
      name TEXT,
      code VARCHAR (3)
    );
    CREATE INDEX  search_fields_planet ON planet
    (
      id
    );
  `);
};

exports.down = async (knex) => {
  return knex.schema.dropTable('planet');
};