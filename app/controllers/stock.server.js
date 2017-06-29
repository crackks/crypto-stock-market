'use strict';

var Client = require('node-rest-client').Client;
 

 


function Stock(){
    
    var client = new Client();
    
    this.getChart=function(req,res){
    var url='https://min-api.cryptocompare.com/data/'+req.params.time+'?fsym=BTC&tsym=USD&limit=60&aggregate=1&e=CCCAGG';   
    client.get(url, function (data, response) {
        res.json(data);
    });
        
    };
    
    
    
}

module.exports=Stock;