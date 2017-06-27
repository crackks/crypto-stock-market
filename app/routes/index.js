'use strict';

var path = process.cwd();
module.exports = function (app, passport) {
    
    app.route('/')
        .get(function(req,res){
            res.render('index');
        });
	
	
};
