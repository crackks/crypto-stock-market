'use strict';

var path = process.cwd();
var Stock=require(path+"/app/controllers/stock.server.js");

module.exports = function (app, io) {
    
    var stock=new Stock();
    
   
	
	
    app.route('/')
        .get(function(req,res){
            res.render('index');
        });
	
	io.on('connection', function (socket) {
		socket.on('time',function(data){
	  		stock.getChart(data.time,function(err,chartData){
	  			if(err)throw err;
	  			socket.emit('news', chartData);
	  		});
		});
		socket.on('removeChart',function(data){
	  		stock.removeChart(data,function(err){
	  			if(err)throw err;
	  			stock.getChart(data.time,function(err,chartData){
		  			if(err)throw err;
		  			socket.emit('news', chartData);
		  		});
			});
		});
	});
        
	app.route('/add?:q')
        .get(stock.addChart);
        
    
	
	
    
};
