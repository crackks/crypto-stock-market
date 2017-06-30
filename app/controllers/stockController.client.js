'use strict';


var graph=document.querySelector('.graph');
var priceChange=document.querySelector('.change');
var apiUrl=window.location.origin+'/hour';
var displayPrice=document.querySelector('.price');


ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showChart));


var hour=document.querySelector('.hour');
var day=document.querySelector('.day');
var week=document.querySelector(".week");
var month=document.querySelector('.month');
var year=document.querySelector('.year');
var all=document.querySelector('.all');

 hour.style['background-color']='rgb(255,255,255)';

hour.addEventListener('click',function(){
    graph.innerHTML="";
    apiUrl=window.location.origin+'/hour';
    reset();
    hour.style['background-color']='rgb(255,255,255)';
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showChart));
});

day.addEventListener('click',function(){
    graph.innerHTML="";
    apiUrl=window.location.origin+'/day';
    reset();
    day.style['background-color']='rgb(255,255,255)';
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showChart));
});


week.addEventListener('click',function(){
    graph.innerHTML="";
    apiUrl=window.location.origin+'/week';
    reset();
    week.style['background-color']='rgb(255,255,255)';
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showChart));
});

month.addEventListener('click',function(){
    graph.innerHTML="";
    apiUrl=window.location.origin+'/month';
    reset();
    month.style['background-color']='rgb(255,255,255)';
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showChart));
});

year.addEventListener('click',function(){
    graph.innerHTML="";
    apiUrl=window.location.origin+'/year';
    reset();
    year.style['background-color']='rgb(255,255,255)';
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showChart));
});

all.addEventListener('click',function(){
    graph.innerHTML="";
    apiUrl=window.location.origin+'/all';
    reset();
    all.style['background-color']='rgb(255,255,255)';
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showChart));
});


function reset(){
    hour.style['background-color']='rgb(150,150,150)';
    day.style['background-color']='rgb(150,150,150)';
    week.style['background-color']='rgb(150,150,150)';
    month.style['background-color']='rgb(150,150,150)';
    year.style['background-color']='rgb(150,150,150)';
    all.style['background-color']='rgb(150,150,150)';
}

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
    var t1=(info.TimeFrom+info.TimeTo)/2;
    var timePos=[10,229,458,687,916];
    var dateMsArray=[info.TimeFrom,(info.TimeFrom+t1)/2,t1,(info.TimeTo+t1)/2,info.TimeTo];
    var txt="";
    for (var i=0; i<dateMsArray.length;i++){
        var date=new Date(dateMsArray[i]*1000);
        txt+='<div class="timeLine" style="margin-left:'+timePos[i]+'px; bottom:-5px;"><div class="displayTime" >'+date.toLocaleString()+'</div>';
        txt+='</div>';
    }
    graph.insertAdjacentHTML('beforeend',txt);
    var ylen=Math.floor(max-min).toString().length;
    var price=[];
    txt="";
    if (ylen!=0){
        for (var k=Math.floor(min);k<max+25*ratio;k++){
            if(k%Math.pow(10,ylen-1)==0){
                price.push(k);
                txt+='<div class="line" style="bottom:'+Number((k-min)/ratio+25)+'px; "></div>';
            }
        }
    }
    graph.insertAdjacentHTML('beforeend',txt);
    txt="";
    for (var j=1;j<info.Data.length;j++){
        var marg=(close[j]-min)/ratio;
        var height=(close[j-1]-min)/ratio-(close[j]-min)/ratio;
        var width=(920-close.length)/(close.length-1)+1;
        var color='rgb(255,0,0)';
        if (height<0){
            marg=marg+height;
            height=Math.abs(height);
            color='rgb(0,255,0)';
        }
        if (j==close.length-1){
            txt+='<div class="point" style="margin-bottom:'+Number(marg+25)+'px; height:'+Number(height+1)+'px; background-color:'+color+'; width:'+width+'px; margin-right:20px"></div>';
        }
        else{
            txt+='<div class="point" style="margin-bottom:'+Number(marg+25)+'px; height:'+Number(height+1)+'px; width:'+width+'px;background-color:'+color+'"></div>';
        }
        
    }
    graph.insertAdjacentHTML('beforeend',txt);
    txt="";
    var firstPrice=close[0];
    var lastPrice=close[close.length-1];
    var pChange=lastPrice-firstPrice;
    if (pChange<0){
        priceChange.innerHTML='<i class="fa fa-arrow-down fa-2x" aria-hidden="true" style="color:rgb(255,0,0); display:flex;"><p style="color:rgb(255,0,0)">'+Math.floor(pChange*100)/100+'$</p></i>';
    }
    else{
        priceChange.innerHTML='<i class="fa fa-arrow-up fa-2x" aria-hidden="true" style="color:rgb(0,255,0); display:flex;"><p style="color:rgb(0,255,0)"> +'+Math.floor(pChange*100)/100+'$</p></i>';
    }
    for (var l=0; l<price.length;l++){
        txt+='<div classe="dispPrice" style="margin-bottom:'+Number(Math.floor(((price[l]-min))/ratio+20))+'px; color:rgb(255,255,255);  margin-right:-3.4%">'+price[l]+'</div>';
    }
    txt+='<div classe="dispPrice" style="margin-bottom:'+Number(Math.floor(((close[close.length-1]-min))/ratio+20))+'px; color:rgb(255,215,215); margin-right:-7.5%  ">'+close[close.length-1]+'</div>';
    graph.insertAdjacentHTML('beforeend',txt);
    
}

