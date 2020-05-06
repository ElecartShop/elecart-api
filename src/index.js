// TODO: Unit Test Suite
// TODO: Full Seeds

const express = require("express");
const mongoose = require('./config/mongoose');
const { ApolloServer } = require('apollo-server-express');
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
mongoose();
const app = express();

const middleware_log = require('./middleware/log');
const middleware_auth= require('./middleware/auth');

app.use('*', cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', middleware_log);
app.use('/', middleware_auth);

const schema = require('./graphql/index');
const apollo = new ApolloServer({
  schema,
  playground: true,
  context: ({ req, connection, res }) => ({
      req,
      res
    })
});

apollo.applyMiddleware({ app, path: '/' });

app.listen(process.env.PORT || 4000, () => {
  console.log('A GraphQL API running at port 4000');
});
