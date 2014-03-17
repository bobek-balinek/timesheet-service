var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mustachex = require('mustachex');
var scookie = require('scookie');

var main = require('./routes/index');
var account = require('./routes/account');
var payslips = require('./routes/payslips');

var app = express();

// view engine setup
app.engine('html', mustachex.express);
app.set('view engine', 'html');
app.set('layout', true);
app.set('views', path.join(__dirname, 'views'));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', main.index);
app.get('/login', main.login);
app.post('/login', main.login);

app.get('/account',scookie.middleware.mustBeLoggedIn,  account.index);
app.post('/account', scookie.middleware.mustBeLoggedIn, account.update);

app.get('/payslips', payslips.index);
app.get('/payslips/view/:employee_id/:date', payslips.view); // View particular payslip

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
