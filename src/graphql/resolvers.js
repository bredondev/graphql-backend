
const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const queries = require('../db/queries');
const { paginateResults, checkCredentials } = require('../utils/tools');
const { TABLES, JWT_SECRET } = require('../utils/constants');

function catchUnauthenticated(context) {
  if (!context.currentUser) {
    throw new Error('Unauthenticated!');
  }
}

module.exports = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,

  Query: {
    planets: async (_, filters, context) => {
      catchUnauthenticated(context);

      return queries.selectFromTable(TABLES.PLANET, filters);
    },

    spaceCenters: async (_, { page, pageSize }, context) => {
      catchUnauthenticated(context);

      let spaceCenters = await queries.selectFromTable(TABLES.SPACE_CENTER);
      spaceCenters = paginateResults({ page, pageSize, results: spaceCenters });

      return spaceCenters;
    },

    spaceCenter: async (_, filters, context) => {
      catchUnauthenticated(context);

      const res = await queries.selectFromTable(TABLES.SPACE_CENTER, filters);

      return res[0];
    },

    flights: async (_, filters, context) => {
      catchUnauthenticated(context);

      let flights = await queries.selectFromTable(
        TABLES.FLIGHT,
        Object.assign({},
          filters.from && { launch_site: filters.from },
          filters.to && { landing_site: filters.to },
          filters.seatCount && { seat_count: filters.seatCount },
        ),
        // we should find a better solution for the date filtering
        // (TO DO: check postgres timestamp type)
        filters.departureDay
          && `departure_at like '${moment(filters.departureDay).format('YYYY-MM-DD')}%'`
      );
      flights = paginateResults({
        page: filters.page,
        pageSize: filters.pageSize,
        results: flights
      });

      return flights;
    },

    flight: async (_, filters, context) => {
      catchUnauthenticated(context);

      const res = await queries.selectFromTable(TABLES.FLIGHT, filters);

      return res[0];
    },

    bookings: async (_, { email, page, pageSize }, context) => {
      catchUnauthenticated(context);

      let bookings = await queries.selectFromTable(TABLES.BOOKING,
        Object.assign({}, email && { email: email }));
      bookings = paginateResults({ page, pageSize, results: bookings, });

      return bookings;
    },

    booking: async (_, filters, context) => {
      catchUnauthenticated(context);

      const res = await queries.selectFromTable(TABLES.BOOKING, filters);

      return res[0];
    },
  },

  Mutation: {
    scheduleFlight: async (_, flight, context) => {
      catchUnauthenticated(context);

      // check date
      if (moment(flight.flightInfo.departureAt).isBefore(moment())) {
        throw new Error('Departure date must be in the future');
      }

      // check spaceCenters exist
      const spaceCentersExist = await queries.checkSpaceCentersExist([
        flight.flightInfo.launchSiteId,
        flight.flightInfo.landingSiteId
      ]);
      if (!spaceCentersExist) {
        throw new Error('Launching site or landing site does not exist');
      }

      // check seatCount
      if (flight.flightInfo.seatCount < 1) {
        throw new Error('Seat count must be >= 1');
      }

      const res = await queries.addFlight(flight.flightInfo);

      return res[0];
    },

    bookFlight: async (_, booking, context) => {
      catchUnauthenticated(context);

      // check seatCount
      if (booking.bookingInfo.seatCount < 1) {
        throw new Error('Seat count must be >= 1');
      }

      const flight = await queries.selectFromTable(
        TABLES.FLIGHT,
        { id: booking.bookingInfo.flightId }
      );

      // check date
      if (moment(flight[0].departure_at).isBefore(moment())) {
        throw new Error('This rocket has already took off');
      }

      const flightBookingsNumber =
        await queries.getFlightBookingsNumber(booking.bookingInfo.flightId);

      // check if the flight is not full
      if ((Number(flightBookingsNumber) + booking.bookingInfo.seatCount)
        > flight[0].seat_count) {
        throw new Error('There is not enough room in the flight for your booking');
      }

      const res = await queries.addBooking(booking.bookingInfo);

      return res[0];
    },

    login: (_, { username, password}) => {
      if (!checkCredentials(username, password)) {
        throw new Error('Invalid credentials');
      }

      return (jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // expires after 1 hour
        data: { username, password },
      }, JWT_SECRET));
    }
  },

  Planet: {
    spaceCenters: async (planet, { limit }) => {
      const fixedLimit = (limit < 1 ? 5 : limit > 10 ? 10 : limit);

      const res = await queries.selectFromTable(
        TABLES.SPACE_CENTER,
        { planet_id: planet.id },
        undefined,
        fixedLimit
      );

      return res;
    }
  },

  SpaceCenter: {
    planet: async (spaceCenter) => {
      const res = await queries.selectFromTable(
        TABLES.PLANET,
        { id: spaceCenter.planet_id }
      );
      return res[0];
    }
  },

  Flight: {
    launchSite: async (flight) => {
      const res = await queries.selectFromTable(
        TABLES.SPACE_CENTER,
        { id: flight.launch_site }
      );
      return res[0];
    },
    landingSite: async (flight) => {
      const res = await queries.selectFromTable(
        TABLES.SPACE_CENTER,
        { id: flight.landing_site }
      );
      return res[0];
    },
    departureAt: (flight) => flight.departure_at,
    seatCount: (flight) => flight.seat_count,
    availableSeats: async (flight) => {
      const flightBookingsNumber = await queries.getFlightBookingsNumber(flight.id);
      return flight.seat_count - flightBookingsNumber;
    },
  },

  Booking: {
    flight: async (booking) => {
      const res = await queries.selectFromTable(
        TABLES.FLIGHT,
        { id: booking.flight_id }
      );
      return res[0];
    },
    seatCount: (booking) => booking.seat_count,
  },
};