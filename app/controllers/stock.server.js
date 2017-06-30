'use strict';

var Client = require('node-rest-client').Client;
var Chart=require('../models/chart.js'); 

 


function Stock(){
    
    var client = new Client();
    
    this.getHourChart=function(req,res){
        var url='https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=60&aggregate=1&e=CCCAGG';   
        client.get(url, function (data, response) {
            res.json(data);
        });
    };
    
    this.getDayChart=function(req,res){
        var url='https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=72&aggregate=50&e=CCCAGG';   
        client.get(url, function (data, response) {
            res.json(data);
        });
    };
    
    this.getWeekChart=function(req,res){
        var url='https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=56&aggregate=3&e=CCCAGG';   
        client.get(url, function (data, response) {
            res.json(data);
        });
    };
    
    this.getMonthChart=function(req,res){
        var url='https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=72&aggregate=10&e=CCCAGG';   
        client.get(url, function (data, response) {
            res.json(data);
        });
    };
    
    
    this.getYearChart=function(req,res){
        var url='https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=72&aggregate=5&e=CCCAGG';   
        client.get(url, function (data, response) {
            res.json(data);
        });
    };
    
    this.getAllChart=function(req,res){
        var url='https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=72&aggregate=30&e=CCCAGG';   
        client.get(url, function (data, response) {
            res.json(data);
        });
    };
    
    
    this.addChart=function(req,res){
        if (req.query.c2){
            var url='https://min-api.cryptocompare.com/data/histoday?fsym='+req.query.c1+'&tsym='+req.query.c2+'&limit=72&aggregate=30&e=CCCAGG';
        }
        else{
            url='https://min-api.cryptocompare.com/data/histoday?fsym='+req.query.c1+'&tsym=USD&limit=72&aggregate=30&e=CCCAGG';
        }
           
        client.get(url, function (data, response) {
           if (data){
               console.log(data);
                var newChart= new Chart({fsym:req.query.c1,tsym:req.query.c2||'USD'})
                
           }
        });
    }
}

module.exports=Stock;