const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { getUserFromToken } = require('./utils/tools');

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
    };
  },
});

const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
);
