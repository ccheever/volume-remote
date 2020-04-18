let { ApolloServer, gql } = require('apollo-server-express');
let express = require('express');
let getLocalIp = require('local-ip');

let volume = require('./volume');

let typeDefs = gql`
  scalar DateTime
  scalar Null

  type Query {
    volume: Int
    muted: Boolean
  }

  type Mutation {
    setVolume(level: Int!): Int
    setMuted(muted: Boolean!): Boolean
    adjustVolume(delta: Int!): Int
  }
`;

let resolvers = {
  Query: {
    volume: async (_, {}, context, info) => {
      return await volume.getVolume();
    },
    muted: async (_, {}, context, info) => {
      return await volume.getMuted();
    },
  },
  Mutation: {
    setVolume: async (_, { level }, context, info) => {
      await volume.setVolume(level);
      return await volume.getVolume();
    },
    adjustVolume: async (_, { delta }, context, info) => {
      await volume.adjustVolume(delta);
      return await volume.getVolume();
    },
    setMuted: async (_, { muted }, context, info) => {
      await volume.setMuted(muted);
      return await volume.getMuted();
    },
  },
};

let server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: {
    settings: {
      'editor.theme': 'dark',
    },
  },
  formatError: (err) => {
    console.error(err);
    return err;
  },
  formatResponse: (res) => {
    console.log(res);
    return res;
  },
  context: ({ req }) => {
    return {};
  },
});

let app = express();

app.get('/', async (req, res) => {
  let name = `🔊 Volume Remote`;
  res.send(`
<html>
    <head>
        <title>${name}</title>
    </head>
    <body>
        <pre>
${name}
<hr />
<a href="/graphql">/graphql</a>
        </pre>
    </body>
</html>
    `);
});

server.applyMiddleware({ app });

let port = process.env.PORT || 10200;

async function mainAsync() {
  return new Promise((resolve, reject) => {
    app.listen({ port }, () => {
      console.log(`Started server`);
      let appUrl = `http://localhost:${port}`;
      let graphqlUrl = `${appUrl}/graphql`;
      let localIp = getLocalIp();
      let lanAppUrl = `http://${localIp}:${port}`;
      let lanGraphqlUrl = `${lanAppUrl}/graphql`;
      console.log(appUrl);
      console.log(graphqlUrl);
      console.log(lanAppUrl);
      console.log(lanGraphqlUrl);
      resolve({
        appUrl,
        graphqlUrl,
        lanAppUrl,
        lanGraphqlUrl,
      });
    });
  });
}

if (require.main === module) {
  mainAsync();
}

module.exports = {
  server,
  app,
  port,
  mainAsync,
};
