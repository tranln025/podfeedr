const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT;

// Routes
const routes = require('./routes');

// ------------------------------------------------- MIDDLEWARE ------------------------------------------------- //

// BodyParser Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Serve Public Directory
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'Sssshhhhhh, this is a secret....',
  resave: false, // save session on every request
  saveUninitialized: false, // Only save session if session exists on req object.
}));

// ------------------------------------------------- ENDPOINTS ------------------------------------------------- //

// HTML Routes
app.use('/', routes.views);

// API Routes
app.use('/api/v1', routes.api);

// ----------------------------------------------- START SERVER ----------------------------------------------- //
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));