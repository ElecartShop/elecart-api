const express = require("express");
const mongoose = require('./config/mongoose');
const graphqlHTTP = require("express-graphql");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = mongoose();
const app = express();

const middleware_log = require('./middleware/log');
const middleware_auth= require('./middleware/auth');
const Call = require('./models/call').Model;

app.use('*', cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', middleware_log);
app.use('/', middleware_auth);

const schema = require('./graphql/index');
app.use('/', cors(), graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true
}));

app.listen(process.env.PORT || 4000, () => {
  console.log('A GraphQL API running at port 4000');
});
