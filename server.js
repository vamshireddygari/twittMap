'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var htmlRoutes = require('./routes/htmlRoutes');
var socketRoutes = require('./routes/socketRoutes');
var swig = require('swig');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
socketRoutes(io);

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.set('view cache', false);

app.use(favicon(__dirname + '/public/img/favicon.ico'));

// Disable this in production code
swig.setDefaults({
    cache: false
});

app.set('port', process.env.PORT || process.env.VCAP_APP_PORT || 5000);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Now all the routes
app.use("/", htmlRoutes);

// Errors
app.use(function(req, res, next) {
    let err = new Error('404: Specified URL Not Found');
    err.status = 404;
    next(err);
});

// Error Handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    return res.status(500).json(err.message);
});

server.listen(app.get('port'), function() {
    console.log('Express Server started on port: ' + app.get('port'));
});
