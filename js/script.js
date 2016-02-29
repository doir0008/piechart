var canvasOne, canvasTwo, contextOne, contextTwo;
var data = 0;
var dataNum = 0;
var total = 0;
var req = new XMLHttpRequest();

function loadData(){
    req.open("GET", "data/browsers.json", false);
        req.onreadystatechange = function() {
            if(req.readyState == 4){
                if(req.status == 200){
                    data = JSON.parse(req.responseText);
                    for(var i=0; i<data.segments.length; i++){
                        total += data.segments[i].value;
                        dataNum++;
                    }
                }
            }
        }
    req.send(null);
}

function showPie(){ 
    contextOne.clearRect(0, 0, canvasOne.width, canvasOne.height);
    contextOne.lineWidth = 3;
    contextOne.font = "bold 8pt Arial";
    contextOne.textAlign = "left";
    var cx = canvasOne.width/2;
    var cy = canvasOne.height/2;
    var radius = 100;
    var currentAngle = 0;
    
    function drawPie(){
        var endAngle = currentAngle + (pct * (Math.PI * 2));
        contextOne.moveTo(cx, cy);
        contextOne.beginPath();
        contextOne.fillStyle = colour;
        contextOne.arc(cx, cy, radius, currentAngle, endAngle, false);  
        contextOne.lineTo(cx, cy);
        contextOne.fill();
        contextOne.save();
        contextOne.translate(cx, cy);
        contextOne.strokeStyle = "#0CF";
        contextOne.lineWidth = 1;
        contextOne.beginPath();
        var midAngle = (currentAngle + endAngle)/2;
        contextOne.moveTo(0,0);
        var dx = Math.cos(midAngle) * (0.8 * radius);
        var dy = Math.sin(midAngle) * (0.8 * radius);
        contextOne.moveTo(dx, dy);
        var dx = Math.cos(midAngle) * (radius + 30);
        var dy = Math.sin(midAngle) * (radius + 30);
        contextOne.lineTo(dx, dy);
        contextOne.stroke();
        if(dx<0){
            contextOne.textAlign = "right";
        }
        contextOne.fillText(data.segments[i].label, dx, dy);
        contextOne.restore();
        currentAngle = endAngle;
    }
    for(var i=0; i<dataNum; i++){
        var pct = data.segments[i].value/total;
        var colour = data.segments[i].color;
        // lazy hardcoded - should rewrite
        if(i===0 | i===4){
            if(i===0){
                radius = 120;
            } else {
                radius = 80;
            }
            drawPie();
        } else {
            radius = 100;
            drawPie();
        }
    }
}

function showCircles(){
    contextTwo.clearRect(0, 0, canvasTwo.width, canvasTwo.height);
    var numPoints = dataNum;
    var padding = 8;
    var magnifier = 12;	
    var horizontalAxis = canvasTwo.height/2;
    var currentPoint = 0;
    var x = 0;
    for(var i=0; i<dataNum; i++){
        var colour = data.segments[i].color;
        var y = Math.random() * 300 + 40;
        var pct = Math.round((data.segments[i].value / total) * 100);
        var radius = Math.sqrt(pct / Math.PI ) * magnifier; 
        x = currentPoint + padding + radius;
        contextTwo.beginPath();
        contextTwo.fillStyle = colour;	
        contextTwo.strokeStyle = "#000";
        contextTwo.lineWidth = 3;
        contextTwo.arc(x, y, radius, 0, Math.PI * 2, false);
        contextTwo.closePath();
        contextTwo.fill();
        contextTwo.stroke();
        var lbl = pct.toString();
        contextTwo.font = "normal 10pt Arial";
        contextTwo.textAlign = "center";
        contextTwo.fillStyle = "#000000";
        contextTwo.beginPath();
        contextTwo.fillText(lbl, x, y+6);
        contextTwo.closePath();
        currentPoint = x + radius;
        contextTwo.textAlign = "center";
        contextTwo.fillStyle = "#FFF"
        contextTwo.fillText(data.segments[i].label, x, y+radius+16);
    }
}

document.addEventListener("DOMContentLoaded", function(){
    canvasOne = document.querySelector("#myCanvasOne");
    contextOne = canvasOne.getContext("2d");
    canvasTwo = document.querySelector("#myCanvasTwo");
    contextTwo = canvasTwo.getContext("2d");
    loadData();
    showPie();
    showCircles();
});