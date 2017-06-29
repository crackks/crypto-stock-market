'use strict';

var path = process.cwd();
var Stock=require(path+"/app/controllers/stock.server.js");

module.exports = function (app, passport) {
    
    
    var stock=new Stock();
    
    app.route('/')
        .get(function(req,res){
            res.render('index');
        });
	
	app.route('/:time')
	    .get(stock.getChart);
	
};
