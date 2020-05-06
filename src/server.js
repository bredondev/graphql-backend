const Koa = require('koa');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const { ApolloServer } = require('apollo-server-koa');
const { IsAuthenticatedDirective } = require('graphql-auth-directives');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const dataLoaders= require('./utils/dataLoaders');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuthenticated: IsAuthenticatedDirective,
  },
  context: (req) => {
    return {
      ...req.ctx,
      dataLoaders: {
        planet: dataLoaders.loadPlanets,
        spaceCenter: dataLoaders.loadSpaceCenters,
        flight: dataLoaders.loadFlights,
      },
    };
  },
});

const app = new Koa();
app.use(cors());
app.use(helmet());
server.applyMiddleware({ app, cors: false });

app.listen({ port: 3000 }, () =>
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
);
