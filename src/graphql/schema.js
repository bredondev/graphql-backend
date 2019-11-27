const { gql } = require('apollo-server-koa');

const typeDefs = gql`
  scalar Date
  scalar DateTime
  type Planet {
    id: ID!
    name: String!
    code: String!
    spaceCenters(limit: Int = 5): [SpaceCenter]!
  }

  type SpaceCenter {
    id: ID!
    uid: String!
    name: String!
    description: String!
    latitude: Float!
    longitude: Float!
    planet: Planet!
  }

  type Flight {
    id: ID!
    code: String!
    departureAt: DateTime!
    launchSite: SpaceCenter!
    landingSite: SpaceCenter!
    seatCount: Int!
    availableSeats: Int!
  }

  input FlightInput {
    departureAt: DateTime!
    launchSiteId: ID!
    landingSiteId: ID!
    seatCount: Int!
  }

  type Booking {
    id: ID!
    seatCount: Int!
    email: String!
    flight: Flight!
  }

  input BookingInput {
    seatCount: Int!
    flightId: ID!
    email: String!
  }

  type Query {
    planets: [Planet]

    spaceCenters(page: Int = 1, pageSize: Int = 10): [SpaceCenter]

    spaceCenter(id: ID, uid: String): SpaceCenter

    flights(
      from: ID
      to: ID
      seatCount: Int
      departureDay: Date
      page: Int = 1
      pageSize: Int = 10
    ): [Flight]

    flight(id: ID!): Flight

    bookings(email: String, page: Int = 1, pageSize: Int = 10): [Booking]

    booking(id: ID!): Booking
  }

  type Mutation {
    scheduleFlight(flightInfo: FlightInput!): Flight
    bookFlight(bookingInfo: BookingInput!): Booking
    login(username: String!, password: String!): String
  }
`;

module.exports = typeDefs;