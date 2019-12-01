const Koa = require('koa');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const { ApolloServer } = require('apollo-server-koa');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { getUserFromToken } = require('./utils/tools');
const dataLoaders= require('./utils/dataLoaders');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req) => {
    let authToken = null;
    let currentUser = null;

    try {
      authToken = (req.ctx.request.header.authorization || '').split(' ')[1];

      if (authToken) {
        currentUser = getUserFromToken(authToken);
      }
    } catch (e) {
      console.warn(`Unable to authenticate: ${e.message}`);
    }

    return {
      authToken,
      currentUser,
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
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
);
