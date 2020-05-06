const moment = require('moment');
const crypto = require('crypto');
const knex = require('./connection');

// knex.on( 'query', (queryData) => {
//   console.log( queryData );
// });

async function selectFromTable(table, { filters, filtersRaw, ids, page, pageSize, limit }) {
  const wantedPage = (page < 1 ? 0 : page - 1);
  let wantedPageSize = (pageSize < 1 ? 1 : pageSize);
  wantedPageSize = (wantedPageSize > 100 ? 100 : wantedPageSize)
    || (limit < 1 ? 5 : limit > 10 ? 10 : limit);

  return knex(table).select('*').modify((queryBuilder) => {
    if (filters) queryBuilder.where(filters);
    if (filtersRaw) queryBuilder.whereRaw(filtersRaw);
    if (ids) queryBuilder.whereIn('id', ids);
    if (wantedPage && wantedPageSize) queryBuilder.offset(wantedPage * wantedPageSize);
    if (wantedPageSize) queryBuilder.limit(wantedPageSize);
  });
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
      launch_site_id: flight.launchSiteId,
      landing_site_id: flight.landingSiteId,
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
