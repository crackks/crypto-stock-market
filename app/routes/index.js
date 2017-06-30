'use strict';

var path = process.cwd();
var Stock=require(path+"/app/controllers/stock.server.js");

module.exports = function (app, passport) {
    
    
    var stock=new Stock();
    
    app.route('/')
        .get(function(req,res){
            res.render('index');
        });
	
	app.route('/hour')
	    .get(stock.getHourChart);
	
	app.route('/day')
	    .get(stock.getDayChart);
	    
	app.route('/week')
	    .get(stock.getWeekChart);
	    
	app.route('/month')
	    .get(stock.getMonthChart);
	    
	app.route('/year')
	    .get(stock.getYearChart);
	    
	app.route('/all')
        .get(stock.getAllChart);
        
    app.route('/add?:q')
        .get(stock.addChart)
};
