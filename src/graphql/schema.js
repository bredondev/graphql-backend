const { gql } = require('apollo-server-koa');

const typeDefs = gql`
  directive @isAuthenticated on OBJECT | FIELD_DEFINITION

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
    planets: [Planet] @isAuthenticated

    spaceCenters(page: Int = 1, pageSize: Int = 10): [SpaceCenter] @isAuthenticated

    spaceCenter(id: ID, uid: String): SpaceCenter @isAuthenticated

    flights(
      from: ID
      to: ID
      seatCount: Int
      departureDay: Date
      page: Int = 1
      pageSize: Int = 10
    ): [Flight] @isAuthenticated

    flight(id: ID!): Flight @isAuthenticated

    bookings(email: String, page: Int = 1, pageSize: Int = 10): [Booking] @isAuthenticated

    booking(id: ID!): Booking @isAuthenticated
  }

  type Mutation {
    scheduleFlight(flightInfo: FlightInput!): Flight @isAuthenticated
    bookFlight(bookingInfo: BookingInput!): Booking @isAuthenticated
    login(username: String!, password: String!): String
  }
`;

module.exports = typeDefs;