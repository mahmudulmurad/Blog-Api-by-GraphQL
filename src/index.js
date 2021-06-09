const express = require('express')
const cors = require('cors')
const { ApolloServer} = require('apollo-server-express')
const port = process.env.PORT
const typeDefs = require('../src/typedefs/typeDefs')
const resolvers = require('../src/resolvers/resolvers')
require('../src/db/mongoose')
const auth = require('../src/middleware/auth')

  async function startApolloServer() {
  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    debug:false,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const user = await auth(token);
      if (!user) return null
      return user
   }
  })
  await server.start()
  const app = express()
  app.use(cors())
  app.use(express.json())
  server.applyMiddleware({ app });

  app.listen(port, ()=> console.log('Apollo server is running on '+port))
}
startApolloServer()