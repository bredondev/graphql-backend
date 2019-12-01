const moment = require('moment');
const crypto = require('crypto');
const knex = require('./connection');

// knex.on( 'query', (queryData) => {
//   console.log( queryData );
// });

async function selectFromTable(table, { filters, filtersRaw, ids, limit }) {
  const query = knex(table).select('*');

  if (filters) query.where(filters);
  if (filtersRaw) query.whereRaw(filtersRaw);
  if (ids) query.whereIn('id', ids);
  if (limit) query.limit(limit);

  return query;
}

async function checkSpaceCentersExist(spaceCentersId) {
  const res = await knex('space_center')
    .select('*')
    .whereIn('id', spaceCentersId);

  return res.length === spaceCentersId.length;
}

// get the number of seat already booked for a flight
async function getFlightBookingsNumber(flighId) {
  const res = await knex('booking')
    .sum('seat_count')
    .where({flight_id: flighId});

  return res[0].sum;
}

async function addFlight(flight) {
  return knex('flight')
    .insert({
      code: crypto.randomBytes(16).toString('hex'),
      departure_at: moment(flight.departureAt).toISOString(),
      seat_count: flight.seatCount,
      launch_site: flight.launchSiteId,
      landing_site: flight.landingSiteId,
    })
    .returning('*');
}

async function addBooking(booking) {
  return knex('booking')
    .insert({
      seat_count: booking.seatCount,
      flight_id: booking.flightId,
      email: booking.email,
    })
    .returning('*');
}

module.exports = {
  addFlight,
  addBooking,
  checkSpaceCentersExist,
  getFlightBookingsNumber,
  selectFromTable,
};
