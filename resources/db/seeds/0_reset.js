exports.seed = async (knex) => {
  return knex('booking').del()
    .then(() => knex('flight').del())
    .then(() => knex('space_center').del())
    .then(() => knex('planet').del());
};