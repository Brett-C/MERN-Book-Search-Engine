const express = require('express');
const path = require('path');
const db = require('../solid-broccoli/Develop/server/config/connection');
const routes = require('../solid-broccoli/Develop/server/routes');
const { ApolloServer} = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('../solid-broccoli/Develop/server/schemas')

const app = express();
const PORT = process.env.PORT || 3005;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const startApolloServer = async () => {
  await server.start();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/graphql'), expressMiddleware(server, {
  context: authMiddleware
});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`User using GraphQL at http://localhost:${PORT}/graphql`);
});

}

startApolloServer();