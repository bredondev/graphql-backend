const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server-koa');
const gql = require('graphql-tag');
const typeDefs = require('../src/graphql/schema');
const resolvers = require('../src/graphql/resolvers');
const queries = require('../src/db/queries');
const dataLoaders= require('../src/utils/dataLoaders');

const planets = [
  { id: '1', name: 'test' },
  { id: '3', name: 'test3' }
];

const spaceCenters = [
  { id: '4', name: 'test4', planet_id: '1' },
  { id: '5', name: 'test5', planet_id: '3' },
  { id: '6', name: 'test6', planet_id: '1' }
];

const planetsWithSpaceCenters = [
  { id: '1', name: 'test', spaceCenters: [{ name: 'test4' }, { name: 'test6' }] },
  { id: '3', name: 'test3', spaceCenters: [{ name: 'test5' }] }
];

queries.checkSpaceCentersExist = jest.fn().mockReturnValue(true);
queries.addFlight = jest.fn((flightInfo) => {
  return [{
    seat_count: flightInfo.seatCount,
    departure_at: flightInfo.departureAt,
    launch_site: flightInfo.launchSiteId,
  }];
});
queries.selectFromTable = jest
  .fn()
  .mockImplementationOnce(() => planets)
  .mockImplementationOnce((_, { filters }) => {
    return spaceCenters.filter((sc) => {
      return sc.planet_id === filters.planet_id;
    });
  })
  .mockImplementationOnce((_, { filters }) => {
    return spaceCenters.filter((sc) => {
      return sc.planet_id === filters.planet_id;
    });
  })
  .mockImplementationOnce((_, { ids }) => {
    return spaceCenters.filter((sc) => {
      return sc.id === ids[0];
    });
  });

const queryPlanets = gql`
  query planets {
    planets {
      id
      name
      spaceCenters {
        name
      }
    }
  }
`;

const scheduleFlight = gql`
mutation scheduleFlight($flightInfo: FlightInput!) {
  scheduleFlight(flightInfo: $flightInfo) {
    departureAt,
    launchSite {
      name
    }
  }
}
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => (
    {
      currentUser: {
        username: 'raclette',
        password: 'tartiflette',
      },
      dataLoaders: {
        spaceCenter: dataLoaders.loadSpaceCenters,
      },
    }
  ),
});

const { query } = createTestClient(server);

describe('GraphQL API tests', () => {
  it('fetches the planets', async () => {
    const res = await query({ query: queryPlanets });
    expect(res.data.planets).toEqual(planetsWithSpaceCenters);
  });
  it('create a flight', async () => {
    const res = await query({
      mutation: scheduleFlight, variables: {
        flightInfo: {
          departureAt: '2050-01-01T02:00:00Z',
          launchSiteId: 4,
          landingSiteId: 5,
          seatCount: 5,
        }
      }
    });
    expect(res.data.scheduleFlight).toEqual({departureAt: '2050-01-01T02:00:00.000Z', launchSite: {name: 'test4'}});
  });
  it('fails at creating a flight', async () => {
    const res = await query({
      mutation: scheduleFlight, variables: {
        flightInfo: {
          departureAt: '2000-01-01T02:00:00Z',
          launchSiteId: 4,
          landingSiteId: 5,
          seatCount: 5,
        }
      }
    });
    expect(res.errors[0].message).toEqual('Departure date must be in the future');
  });
});
