'use strict';


var graph=document.querySelector('.graph');
var priceChange=document.querySelector('.change');
var apiUrl=window.location.origin+'/histominute';
var displayPrice=document.querySelector('.price');
//var apiUrl='https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=60&aggregate=3&e=CCCAGG';
ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showChart));


var hour=document.querySelector('.hour');
var day=document.querySelector('.day');
var week=document.querySelector(".week");
var month=document.querySelector('.month');
var year=document.querySelector('.year');
var all=document.querySelector('.all');


hour.addEventListener('click',function(){
    graph.innerHTML="";
    apiUrl=window.location.origin+'/histominute';
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showChart));
})


function showChart(data){
    var info=JSON.parse(data);
    console.log(info);
    var close=[];
    var max=0;
    var min=Infinity;
    for (var i=0; i<info.Data.length;i++){
        close[i]=info.Data[i].close;
        if (info.Data[i].close>max){
            max=info.Data[i].close;
        }
        if (info.Data[i].close<min){
            min=info.Data[i].close;
        }
        
    }
    
    var ratio=(max-min)/350;
    var from=new Date (info.TimeFrom*1000);
    var to=new Date (info.TimeTo*1000);
    var ylen=Math.floor(max-min).toString().length;
    var price=[]
    var txt="";
    if (ylen!=0){
        for (var k=Math.floor(min);k<max;k++){
            if(k%Math.pow(10,ylen-1)==0){
                price.push(k);
                txt+='<div class="line" style="bottom:'+Number((k-min)/ratio)+'px; "></div>';
            }
        }
    }
    graph.insertAdjacentHTML('beforeend',txt);
     txt="";
    for (var j=1;j<info.Data.length;j++){
        var marg=(close[j]-min)/ratio;
        var height=(close[j-1]-min)/ratio-(close[j]-min)/ratio;
        var color='rgb(255,0,0)';
        if (height<0){
            marg=marg+height;
            height=Math.abs(height);
            color='rgb(0,255,0)';
        }
        txt+='<div class="point" style="margin-bottom:'+Number(marg+25)+'px; height:'+Number(height+1)+'px; background-color:'+color+'"></div>';
    }
    graph.insertAdjacentHTML('beforeend',txt);
    txt="";
    var firstPrice=close[0];
    var lastPrice=close[close.length-1];
    var pChange=lastPrice-firstPrice;
    if (pChange<0){
        priceChange.innerHTML='<i class="fa fa-arrow-down fa-2x" aria-hidden="true" style="color:rgb(255,0,0); display:flex;"><p style="color:rgb(255,0,0)">'+Math.floor(pChange*100)/100+'</p></i>';
    }
    else{
        priceChange.innerHTML='<i class="fa fa-arrow-up fa-2x" aria-hidden="true" style="color:rgb(0,255,0); display:flex;"><p style="color:rgb(0,255,0)"> +'+Math.floor(pChange*100)/100+'</p></i>';
    }
    for (var l=0; l<price.length;l++){
        txt+='<div classe="dispPrice" style="bottom:'+Number(((price[l]-min))/ratio+50)+'px; color:rgb(255,255,255)">'+price[l]+'</div>';
    }
    graph.insertAdjacentHTML('beforeend',txt);
}

