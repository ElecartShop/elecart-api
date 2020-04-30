const express = require("express");
const mongoose = require('./config/mongoose');
const graphqlHTTP = require("express-graphql");
const cors = require("cors");
const db = mongoose();
const app = express();

app.use('*', cors());

const schema = require('./graphql/index');
app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true
}));

app.listen(process.env.PORT || 3000, () => {
  console.log('A GraphQL API running at port 3000');
});
