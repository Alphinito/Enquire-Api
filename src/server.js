var express = require("express")
var { graphqlHTTP } = require("express-graphql")
var { buildSchema } = require("graphql")
var { PrismaClient } = require("@prisma/client")

//prisma config
var prisma = new PrismaClient()

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }

  type User {
    us_nombre: String!
    us_identificacion: String!
  }

  type Mutation {
    createUser(
      us_nombre: String!
      us_identificacion: String!
    ): User
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return "Hello world!"
  },

  createUser: async ({ us_identificacion, us_nombre }) => {
    const newUser = await prisma.user.create({
      data: {
        us_nombre: us_nombre,
        us_identificacion: us_identificacion,
        us_area: 1,
        us_activo: true,
      }
    })
    return newUser
  },
}

var app = express()
app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)
app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")