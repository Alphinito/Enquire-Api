var express = require("express")
var { graphqlHTTP } = require("express-graphql")
var { buildSchema } = require("graphql")
var { PrismaClient } = require("@prisma/client")

//prisma config
var prisma = new PrismaClient()

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`

  type Area {
    ar_id: Int!
    ar_area: String!
    user_area_ar_encargadoTouser: User
    user_user_us_areaToarea: [User!]!
  }
  
  type Form {
    fo_id: Int!
    fo_nombre: String!
    fo_creador: Int!
    fo_fecha: String
    user: User!
    form_config: [FormConfig!]!
    form_module: [FormModule!]!
  }
  
  type FormConfig {
    foc_id: Int!
    foc_form: Int!
    foc_evalua_encargado: Boolean
    foc_evalua_jefe: Boolean
    form: Form!
  }
  
  type FormModule {
    fom_id: Int!
    fom_order: Int!
    form: Form
    form_question_multiple1: [FormQuestionMultiple1!]!
    form_question_multiple2: [FormQuestionMultiple2!]!
    form_question_open: [FormQuestionOpen!]!
    form_question_range: [FormQuestionRange!]!
  }
  
  type FormQuestionMultiple1 {
    foqm_id: Int!
    foqm_module: Int!
    foqm_question: String!
    foqm_options: [String!]!
    form_module: FormModule!
    form_response_multiple1: [FormResponseMultiple1!]!
  }
  
  type FormQuestionMultiple2 {
    foqm_id: Int!
    foqm_module: Int!
    foqm_question: String!
    foqm_options: [String!]!
    form_module: FormModule!
    form_response_multiple2: [FormResponseMultiple2!]!
  }
  
  type FormQuestionOpen {
    foqo_id: Int!
    foqo_module: Int!
    foqo_question: String!
    form_module: FormModule!
    form_response_open: [FormResponseOpen!]!
    form_response_range: [FormResponseRange!]!
  }
  
  type FormQuestionRange {
    foqr_id: Int!
    foqr_module: Int!
    foqr_question: String!
    foqr_initial: Int!
    foqr_final: Int!
    form_module: FormModule!
  }
  
  type FormResponseMultiple1 {
    form_id: Int!
    form_question: Int!
    form_user: Int!
    form_response: Int!
    form_time: Int!
    form_question_multiple1: FormQuestionMultiple1!
    user: User!
  }
  
  type FormResponseMultiple2 {
    form_id: Int!
    form_question: Int!
    form_user: Int!
    form_response: [Int!]!
    form_time: Int!
    form_question_multiple2: FormQuestionMultiple2!
    user: User!
  }
  
  type FormResponseOpen {
    foro_id: Int!
    foro_question: Int!
    foro_user: Int!
    foro_response: String!
    foro_time: Int!
    form_question_open: FormQuestionOpen!
    user: User!
  }
  
  type FormResponseRange {
    forr_id: Int!
    forr_question: Int!
    forr_user: Int!
    forr_response: Int!
    forr_time: Int!
    form_question_open: FormQuestionOpen!
    user: User!
  }
  
  type User {
    us_id: Int!
    us_nombre: String!
    us_identificacion: String!
    us_area: Int!
    us_jefe: Int
    us_activo: Boolean
    area_area_ar_encargadoTouser: [Area!]!
    form: [Form!]!
    form_response_multiple1: [FormResponseMultiple1!]!
    form_response_multiple2: [FormResponseMultiple2!]!
    form_response_open: [FormResponseOpen!]!
    form_response_range: [FormResponseRange!]!
    area_user_us_areaToarea: Area!
    user: User
    other_user: [User!]!
    user_acces: [UserAccess!]!
  }
  
  type UserAccess {
    usa_id: Int!
    usa_user: Int!
    usa_evaluar: Boolean
    usa_crud_fo: Boolean
    usa_crud_us: Boolean
    usa_crud_ar: Boolean
    user: User!
  }
 

  type Query {
    hello: String
    getUser: [User]!
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

  getUser: async() =>{
    return await prisma.user.findMany({
      include: {
        user_acces: true,
      },
    })
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