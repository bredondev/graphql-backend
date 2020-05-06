const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { AuthenticationError, UserInputError, } = require('apollo-server-koa');
const queries = require('../db/queries');
const { checkCredentials } = require('../utils/tools');
const { TABLES, JWT_SECRET } = require('../utils/constants');

module.exports = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,

  Query: {
    planets: async (_, filters) => {
      return queries.selectFromTable(TABLES.PLANET, { filters });
    },

    spaceCenters: async (_, { page, pageSize }) => {
      const spaceCenters = await queries.selectFromTable(
        TABLES.SPACE_CENTER,
        { page, pageSize }
      );

      return spaceCenters;
    },

    spaceCenter: async (_, filters) => {
      const res = await queries.selectFromTable(TABLES.SPACE_CENTER, { filters });

      return res[0];
    },

    flights: async (_, filters) => {
      const flights = await queries.selectFromTable(
        TABLES.FLIGHT,
        {
          filters: Object.assign({},
            filters.from && { launch_site_id: filters.from },
            filters.to && { landing_site_id: filters.to },
            filters.seatCount && { seat_count: filters.seatCount },
          ),
          filtersRaw: filters.departureDay
            && `(departure_at::DATE) = '${
              moment(filters.departureDay).format('YYYY-MM-DD')
            }'`,
          page: filters.page,
          pageSize: filters.pageSize,
        }
      );

      return flights;
    },

    flight: async (_, filters) => {
      const res = await queries.selectFromTable(TABLES.FLIGHT, { filters });

      return res[0];
    },

    bookings: async (_, { email, page, pageSize }) => {
      const bookings = await queries.selectFromTable(TABLES.BOOKING,
        {
          filters: Object.assign({}, email && { email: email }),
          page,
          pageSize,
        });

      return bookings;
    },

    booking: async (_, filters) => {
      const res = await queries.selectFromTable(TABLES.BOOKING, { filters });

      return res[0];
    },
  },

  Mutation: {
    scheduleFlight: async (_, flight) => {
      // check date
      if (moment(flight.flightInfo.departureAt).isBefore(moment())) {
        throw new UserInputError('Departure date must be in the future');
      }

      // check spaceCenters exist
      const spaceCentersExist = await queries.checkSpaceCentersExist([
        flight.flightInfo.launchSiteId,
        flight.flightInfo.landingSiteId
      ]);
      if (!spaceCentersExist) {
        throw new UserInputError('Launching site or landing site does not exist');
      }

      // check seatCount
      if (flight.flightInfo.seatCount < 1) {
        throw new UserInputError('Seat count must be >= 1');
      }

      const res = await queries.addFlight(flight.flightInfo);

      return res[0];
    },

    bookFlight: async (_, booking) => {
      // check seatCount
      if (booking.bookingInfo.seatCount < 1) {
        throw new UserInputError('Seat count must be >= 1');
      }

      const flight = await queries.selectFromTable(
        TABLES.FLIGHT,
        { filters: { id: booking.bookingInfo.flightId }}
      );

      // check date
      if (moment(flight[0].departure_at).isBefore(moment())) {
        throw new UserInputError('This rocket has already took off');
      }

      const flightBookingsNumber =
        await queries.getFlightBookingsNumber(booking.bookingInfo.flightId);

      // check if the flight is not full
      if ((Number(flightBookingsNumber) + booking.bookingInfo.seatCount)
        > flight[0].seat_count) {
        throw new UserInputError('There is not enough room in the flight for your booking');
      }

      const res = await queries.addBooking(booking.bookingInfo);

      return res[0];
    },

    login: (_, { username, password}) => {
      if (!checkCredentials(username, password)) {
        throw new AuthenticationError('Invalid credentials');
      }

      return (jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // expires after 1 hour
        data: { username },
      }, JWT_SECRET));
    }
  },

  Planet: {
    spaceCenters: async (planet, { limit }) => {
      const res = await queries.selectFromTable(
        TABLES.SPACE_CENTER,
        {
          filters: { planet_id: planet.id },
          limit,
        }
      );

      return res;
    }
  },

  SpaceCenter: {
    planet: async (spaceCenter, filters, { dataLoaders }) => {
      return dataLoaders.planet.load(spaceCenter.planet_id);
    }
  },

  Flight: {
    launchSite: async (flight, filters, { dataLoaders }) => {
      return dataLoaders.spaceCenter.load(flight.launch_site_id);
    },
    landingSite: async (flight, filters, { dataLoaders }) => {
      return dataLoaders.spaceCenter.load(flight.landing_site_id);
    },
    departureAt: (flight) => flight.departure_at,
    seatCount: (flight) => flight.seat_count,
    availableSeats: async (flight) => {
      const flightBookingsNumber = await queries.getFlightBookingsNumber(flight.id);
      return flight.seat_count - flightBookingsNumber;
    },
  },

  Booking: {
    flight: async (booking, filters, { dataLoaders }) => {
      return dataLoaders.flight.load(booking.flight_id);
    },
    seatCount: (booking) => booking.seat_count,
  },
};