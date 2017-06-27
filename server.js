'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');
var expHb=require('express-handlebars');
var flash=require("connect-flash");

var app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.set('views', __dirname + '/public');
app.engine('handlebars',expHb('defaultLayout:layout'));
app.set('view engine', 'handlebars');


app.use(session({
	secret: 'CryptoSuperStock',
	resave: false,
	saveUninitialized: true
}));

app.use(flash());


app.use(function(req,res,next){
  
	res.locals.success_msg=req.flash('success_msg');
	res.locals.success_msg2=req.flash('success_msg2');
	res.locals.error_msg=req.flash('error_msg');
	res.locals.error=req.flash('error');
	next();
});

routes(app);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
