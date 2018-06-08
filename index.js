// Define base dir to global.
global.__basedir = __dirname;

// load app.
var app = require('./core/app');
var Server = app.createServer();

Server.listen(8080, '127.0.0.1');
