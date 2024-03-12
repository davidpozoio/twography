const dotenv = require('dotenv');
dotenv.config({
  path: '.env',
});
const environment = require('./config/environment');
const { server } = require('./io');

server(environment.port);
