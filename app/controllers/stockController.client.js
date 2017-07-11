'use strict';


var graph=document.querySelector('.graph');
var newGraph=document.querySelector('.newChart');
var addNewGraph=document.querySelector('.newGraph');
var chart="";
var currentTime='hour';

var hour=document.querySelector('.hour');
var day=document.querySelector('.day');
var week=document.querySelector(".week");
var month=document.querySelector('.month');
var year=document.querySelector('.year');
var all=document.querySelector('.all');

var timeArray=[hour,day,week,month,year,all];
var temeArray2str=['hour','day','week','month','year','all'];
hour.style['background-color']='rgb(255,255,255)';

timeArray.forEach(function(elem, index){
    elem.addEventListener('click',function(){
       currentTime=temeArray2str[index]; 
       reset();
       elem.style['background-color']='rgb(255,255,255)';
       socket.emit('time',{time:currentTime});
    });
});

function reset(){
    timeArray.forEach(function(elem){
        elem.style['background-color']='rgb(150,150,150)';
    });
}



function showChart(data){
    console.log(data);
    graph.innerHTML="";
    newGraph.innerHTML="";
    chart=data.chartData;
    var info=data.chart;
    console.log(info);
    var close=[];
    var max=0;
    var min=Infinity;
    for (var m=0;m<info.length;m++){
        close.push([]);
        for (var i=0; i<info[m].Data.length;i++){
            close[m][i]=info[m].Data[i].close;
            if (info[m].Data[i].close>max){
                max=info[m].Data[i].close;
            }
            if (info[m].Data[i].close<min){
                min=info[m].Data[i].close;
            }
        }
    }
    var borderColor=['rgb(50,120,190)','rgb(220,120,120)','rgb(120,220,120)','rgb(120,120,220)','rgb(150,50,150)','rgb(250,250,20)','rgb(220,120,0)','rgb(10,10,10)'];
    var currentPrice=[];
    for (var l=0;l<close.length;l++){
        currentPrice.push(close[l][close[l].length-1]);
    }
    var ratio=(max-min)/350;
    var delta=ratio*40;
    var t1=(info[0].TimeFrom+info[0].TimeTo)/2;
    var timePos=[10,230,460,690,920];
    var dateMsArray=[info[0].TimeFrom,(info[0].TimeFrom+t1)/2,t1,(info[0].TimeTo+t1)/2,info[0].TimeTo];
    var txt="";
    for (var i=0; i<dateMsArray.length;i++){
        var date=new Date(dateMsArray[i]*1000);
        txt+='<div class="timeLine" style="margin-left:'+timePos[i]*100/920+'%; bottom:-5px;"><div class="displayTime" >'+date.toLocaleString()+'</div>';
        txt+='</div>';
    }
    graph.insertAdjacentHTML('beforeend',txt);
    var p1=(max+min)/2;
    var pArray=[min,(min+p1)/2,p1,(max+p1)/2,max];
    var ypos=[25,122.5,200,287.5,375];
    for (var k=0; k<pArray.length;k++){
        txt+='<div class="line" style="bottom:'+ypos[k]+'px; "></div>';
        if (checked(pArray[k],delta,currentPrice)){
        txt+='<div class="dispPrice" style="bottom:'+Number(ypos[k]-7.5)+'px; color:rgb(255,255,255);  margin-right:-3.4%">'+Math.floor(pArray[k])+'</div>';
        }
    }
    graph.insertAdjacentHTML('beforeend',txt);
    txt="";
    for (var n=0;n<info.length;n++){
        for (var j=1;j<info[n].Data.length;j++){
            var marg=(close[n][j]-min)/ratio;
            var height=(close[n][j-1]-min)/ratio-(close[n][j]-min)/ratio;
            var width=(1000-close[n].length)/(close[n].length-1);
            var color='rgb(255,0,0)';
            if (height<0){
                marg=marg+height;
                height=Math.abs(height);
                color='rgb(0,255,0)';
            }
            if (j==close[n].length-1){
                txt+='<div class="point" style="bottom:'+Number(marg+25)+'px; height:'+Number(height+1)+'px;border-color:'+borderColor[n]+'; background-color:'+color+'; width:'+Number(width/10)+'%; margin-right:20px;left:'+(j-1)*(width/10+0.1)+'%"></div>';
            }
            else{
                txt+='<div class="point" style="bottom:'+Number(marg+25)+'px; height:'+Number(height+1)+'px; border-color:'+borderColor[n]+';width:'+width/10+'%;background-color:'+color+'; left:'+(j-1)*(width/10+0.1)+'%"></div>';
            }
            
        }
    }
    graph.insertAdjacentHTML('beforeend',txt);
    txt="";
    for (var o=0; o<close.length;o++){
         txt+='<div class="dispCurrentPrice" style="bottom:'+Number(Math.floor(((close[o][close[o].length-1]-min))/ratio+20))+'px; color:'+borderColor[o]+'; margin-right:-5.5%  ">'+close[o][close[o].length-1]+'</div>';
        
    }
    graph.insertAdjacentHTML('beforeend',txt);
    txt='';
    for (var i=0; i<close.length;i++){
        txt+='<div class="dispGraphContainer" style="background-color:'+borderColor[i]+'">';
        txt+='<button class="remove'+i+' btn cross-btn fa fa-times" aria-hidden="true"style="background-color:'+borderColor[i]+'"></button>';
        txt+='<div class="currency">'+data.chartData[i].fsym+'/'+data.chartData[i].tsym+'</div><div class="change">';
        var firstPrice=close[i][0];
        if (firstPrice==0){
            firstPrice=0.01;
        }
        var lastPrice=close[i][close[i].length-1];
        var pChange=lastPrice-firstPrice;
        var perCentChange=Math.floor(pChange/firstPrice*10000)/100;
        if (pChange<0){
            txt+='<i class="fa fa-arrow-down fa-2x" aria-hidden="true" style="color:rgb(255,0,0); display:flex;"><p style="color:rgb(255,0,0)">  '+Math.floor(pChange*100)/100+' / '+perCentChange+'%</p></i>';
        }
        else{
            txt+='<i class="fa fa-arrow-up fa-2x" aria-hidden="true" style="color:rgb(0,255,0); display:flex;"><p style="color:rgb(0,255,0)">  +'+Math.floor(pChange*100)/100+' / '+perCentChange+'%</p></i>';
        }
        txt+='</div></div>'; 
    }
    newGraph.insertAdjacentHTML('beforeend',txt);
    if (close.length>7){
        addNewGraph.style.display='none';
    }
    else{
        addNewGraph.style.display='flex';
    }
    var arrQuery=[];
    for (var i=0; i<close.length;i++){
        arrQuery.push(document.querySelector('.remove'+i));
    }
    arrQuery.forEach(function(elem,index){
        elem.addEventListener('click',function(){removeChart(index)});
    });
}

function checked (number,delta,currentPrice){
    for (var i=0;i<currentPrice.length;i++){
        if (currentPrice[i]+delta>number&&currentPrice[i]-delta<number){
            if(currentPrice[i]!=number){
                return false;
            }    
        }
    }
    return true;
}


function removeChart(index){
    socket.emit('removeChart',{chart:{fsym:chart[index].fsym,tsym:chart[index].tsym},time:currentTime}); 
}

var socket = io.connect('https://nightlife-coordination-app-crkx35.c9users.io');
socket.on('news', function (data) {
    showChart(data);
});
window.onload=function(){
    socket.emit('time',{time:currentTime});
};
