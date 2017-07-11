'use strict';
 
var Client = require('node-rest-client').Client;
var Chart=require('../models/chart.js'); 
 
  
 
function Stock(){
     
    var client = new Client();
      
      
    this.getChart=function(data,callback){
        if(data=='hour'){
            openDataBase('histominute',60,1,callback); 
        }
        else if(data=='day'){
            openDataBase('histominute',72,50,callback);  
        }
        else if (data=='week'){
            openDataBase('histohour',56,3,callback);  
        }
        else if (data=='month'){
            openDataBase('histohour',72,10,callback);  
        }
        else if (data=='year'){
            openDataBase('histoday',72,5,callback);   
        }
        else{
            openDataBase('histoday',72,30,callback);  
        }
    };
      
      
     
      
    function openDataBase(time,limit,aggregate,callback){
        Chart.find().exec(function(err,chartData){
            if (err) throw err;
            var i=0;
            var imax=chartData.length-1;
            var resArray=[];
            getOneChart(i,imax,chartData,resArray,time,limit,aggregate,callback); 
        });  
    }
     
    function getOneChart(i,imax,chartData,resArray,time,limit,aggregate,callback){
            var url='https://min-api.cryptocompare.com/data/'+time+'?fsym='+chartData[i].fsym+'&tsym='+chartData[i].tsym+'&limit='+limit+'&aggregate='+aggregate+'&e=CCCAGG';   
            client.get(url, function (data, response) {
                if (i<imax){
                    resArray.push(data);
                    i++;
                    getOneChart(i,imax,chartData,resArray,time,limit,aggregate,callback);
                }
                else{
                    resArray.push(data);
                    var sendData={chart:resArray,chartData:chartData};
                    callback(null,sendData); 
                }
            });
        }
     
     
     
     
    this.addChart=function(req,res){
        var fsym=req.query.c1.toUpperCase();
        var tsym='USD';
        if (req.query.c2){
            tsym=req.query.c2.toUpperCase();
        }     
        var url='https://min-api.cryptocompare.com/data/histoday?fsym='+fsym+'&tsym='+tsym+'&limit=72&aggregate=30&e=CCCAGG';
        client.get(url, function (data, response) {
            if (data.Response=='Success'){
                if (data.ConversionType.type=='invert'){
                    var a=fsym;
                    fsym=tsym;
                    tsym=a;
                }
                else if(data.ConversionType.type=='multiply'){
                    tsym=data.ConversionType.conversionSymbol;
                }
                else if (data.ConversionType.type=='invert_multiply'){
                    fsym=tsym;
                    tsym=data.ConversionType.conversionSymbol;
                }
                Chart.find({fsym:fsym,tsym:tsym}).exec(function(err,chart){
                    if (err)throw err;
                    if(!chart[0]){
                        Chart.find().exec(function(err,allChart){
                            if (err)throw err;
                            if (allChart.length>7){
                                req.flash('error_msg','Maximum chart capacity reached!');
                                res.redirect('/');
                            }
                            else{
                                var newChart=new Chart({fsym:fsym,tsym:tsym});
                                newChart.save(function(err,saved){
                                    if (err)throw err;
                                    var msg=fsym+'/'+tsym+' has been added!';
                                    req.flash('success_msg',msg);
                                    res.redirect('/');
                                });
                            }
                        });
                    }
                    else{
                        req.flash('error_msg','This Chart is already there!');
                        res.redirect('/');
                    }
                });
            }
            else{
                req.flash('error_msg','The chart was not found');
                res.redirect('/');
            }
          });

     };
     
    this.removeChart=function(data,callback){
        Chart.remove(data.chart).exec(function(err,dataChart){
            if (err)throw err;
            callback(null);
        });
    };
}
  
  module.exports=Stock; 