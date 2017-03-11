/**
 * Created by danr on 2017/3/11.
 */
var maxLineWidth = 30;
var minLineWidth = 1;
var maxV = 10;
var minV = 0.1;

var canvasWidth = Math.min(600, $(window).width()-20);//屏幕自适应
var canvasHeight = canvasWidth;
var isMouseDown = false;//检测鼠标状态
var lastLoc = {x:0, y:0};
var lastTime = 0;
var lastLineWidth = -1;
var strokeColor = "black";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

$(".controller").css("width",canvasWidth+"px");
//清空画布
$("#clear_btn").click(function (e) {
    context.clearRect(0,0,canvasWidth,canvasHeight);
    drawBg();
});
$(".color_btn").click(function (e) {
    $(".color_btn").removeClass("color_btn_selected");
    $(this).addClass("color_btn_selected");
    strokeColor = $(this).css("background-color");
});

//触控事件
function beginStroke(point) {
    isMouseDown = true;
    lastLoc = windowToCanvas(point.x,point.y);//鼠标点击位置转换为canvas中的位置
    lastTime = new Date().getTime();//记录上次时间
}
function endStroke() {
    isMouseDown = false;
}
function moveStroke(point) {
    var curLoc = windowToCanvas(point.x, point.y);
    var curTime = new Date().getTime();
    //draw
    var s = distance(lastLoc,curLoc);
    var t = curTime - lastTime;

    var lineWidth = diffLineWidth(s,t);

    context.beginPath();
    context.moveTo(lastLoc.x,lastLoc.y);
    context.lineTo(curLoc.x,curLoc.y);
    context.closePath();
    context.strokeStyle = strokeColor;
    context.lineWidth= lineWidth;
    context.lineCap = "round";//解决粗线条毛边问题
    context.lineJoin = "round";
    context.stroke();
    lastLoc = curLoc;
    lastTime = curTime;
    lastLineWidth = lineWidth;
}
canvas.onmousedown = function (e) {
    e.preventDefault();//阻止浏览器默认动作发生
    beginStroke({x:e.clientX,y:e.clientY});
}
canvas.onmouseup = function (e) {
    e.preventDefault();
    endStroke();

}
canvas.onmouseout = function (e) {
    e.preventDefault();
    endStroke();

}
canvas.onmousemove = function (e) {
    e.preventDefault();
    if(isMouseDown){
        moveStroke({x:e.clientX,y:e.clientY});
    }
}

function diffLineWidth(s,t) {
    var v = s/t;
    var resultLineWidth;
    if(v <= minV)
    {
        resultLineWidth = maxLineWidth;
    }else if(v >= maxV)
    {
        resultLineWidth = minLineWidth;
    }else{
        resultLineWidth = maxLineWidth - (v-minV)/(maxV-minV)*(maxLineWidth-minLineWidth);
    }
    if(lastLineWidth == -1){
        return resultLineWidth;
    }
    return resultLineWidth*1/3 + 2/3*lastLineWidth;

}
//触控事件
canvas.addEventListener('touchstart',function (e) {
    e.preventDefault();
    touch = e.touches[0];
    beginStroke({x:touch.pageX,y:touch.pageY});
});
canvas.addEventListener('touchmove',function (e) {
    e.preventDefault();
    if(isMouseDown){
        touch = e.touches[0];
        moveStroke({x:touch.pageX,y:touch.pageY});
    }
});
canvas.addEventListener('touchend',function (e) {
    e.preventDefault();
    endStroke();
})

function distance(lastLoc,curLoc) {
    return Math.sqrt((lastLoc.x-curLoc.x) * (lastLoc.x-curLoc.x) + (lastLoc.y-curLoc.y) * (lastLoc.y-curLoc.y));
}
function windowToCanvas(x,y) {
    var bbox = canvas.getBoundingClientRect();
    return {x:Math.round(x-bbox.left), y:Math.round(y-bbox.top)};
}
function drawBg() {
    //外边框
    context.save();

    context.beginPath();
    context.moveTo(3,3);
    context.lineTo(canvasWidth-3,3);
    context.lineTo(canvasWidth-3,canvasHeight-3);
    context.lineTo(3,canvasHeight-3);
    context.closePath();
    context.strokeStyle="red";
    context.lineWidth = 6;
    context.stroke();
//米字格
    context.beginPath();
    context.setLineDash([5,5]);
    context.moveTo(3,3);
    context.lineTo(canvasWidth-3,canvasHeight-3);

    context.moveTo(3,canvasHeight-3);
    context.lineTo(canvasWidth-3,3);

    context.moveTo(canvasWidth/2,3);
    context.lineTo(canvasWidth/2,canvasHeight-3);

    context.moveTo(3,canvasHeight/2);
    context.lineTo(canvasWidth-3,canvasHeight/2);
    context.closePath();
    context.lineWidth=1;
    context.stroke();

    context.restore();
}
drawBg();
