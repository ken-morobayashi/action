$(document).ready(function(){
	updateDraw();
});

function updateDraw(){
	
	var clockHandler = new ClockHandler($("#canvas"));
	clockHandler.dateStart = new Date();
	
	if($(window).width() <= 480){
    	clockHandler.resize(318,240);
    }else{
    	clockHandler.resize(720,360);
    }
	$(window).on("resize", function(){
	    if($(window).width() <= 480){
	    	clockHandler.resize(318,240);
	    }else{
	    	clockHandler.resize(720,360);
	    }
	});
	
	clockHandler.drawClock();
	
	if (clockHandler.dateStart.getSeconds() == clockHandler.dateNow.getSeconds()) {
		setTimeout("updateDraw()", 100);
		return false;
	}
	
	setTimeout("updateDraw()", 100);
	return true;
}

function ClockHandler(canvas){
    this.canvas = canvas;
    this.canvasElement = canvas.get(0);
    this.context = this.canvasElement.getContext("2d");
    this.context.fillStyle = "black";
    this.context.strokeStyle = "black";
	this.centerX = 0;
	this.centerY = 0;
	this.dateStart;
	this.dateNow;
	
    this.resize = function (width,height){
        this.canvas.attr("width",width);
        this.canvas.attr("height",height);
    }
    
    //カラー
    this.setColor = function (color){
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
    }
    
    //時計描画
    this.drawClock = function (){
    	this.centerX = this.canvas.attr("width") / 2;
		this.centerY = this.canvas.attr("height") / 2;
		this.context.clearRect(0, 0, this.canvas.attr("width"), this.canvas.attr("height"));
		this.dateNow = new Date();
		this.drawClockBase();
		this.drawClockTime();
		//this.drawClockString();
    }
    
    //基盤描画
    this.drawClockBase = function (){
		// 変数宣言
		var clockNumbers = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
		var roundCanvas = Math.min(this.centerX, this.centerY);
		var roundLineStart = roundCanvas * 0.97;
		var roundLineEndShort = roundCanvas * 0.94;
		var roundLineEndLong = roundCanvas * 0.91;
		var roundString = roundCanvas * 0.85;
		
		// 基盤の描写
		this.context.font = "normal 24px 'Times New Roman'";
		this.context.textAlign = "center";
		this.context.textBaseline = "middle";
		this.context.beginPath();
		this.context.arc(this.centerX, this.centerY, roundCanvas, 0, Math.PI * 2, false);
		this.setColor("white");
		this.context.fill();
		
		this.setColor("black");
		this.context.beginPath();
		var i, angle;
		for (i = 0; i < 60; i++) {
			angle = Math.PI * i / 30;
			this.context.moveTo(this.centerX + Math.sin(angle) * roundLineStart, this.centerY + -Math.cos(angle) * roundLineStart);
			if (i % 5 == 0) {
				this.context.lineTo(this.centerX + Math.sin(angle) * roundLineEndLong, this.centerY + -Math.cos(angle) * roundLineEndLong);
				this.context.fillText(clockNumbers[i / 5], this.centerX + Math.sin(angle) * roundString, this.centerY + -Math.cos(angle) * roundString);
			} else {
				this.context.lineTo(this.centerX + Math.sin(angle) * roundLineEndShort, this.centerY + -Math.cos(angle) * roundLineEndShort);
			}
		}
		this.context.stroke();
    }
    
    //針描画
    this.drawClockTime = function (){
		// 変数宣言
		var roundCanvas = Math.min(this.centerX, this.centerY);
		var roundHour = roundCanvas * 0.575;
		var roundMinute = roundCanvas * 0.825;
		var roundSecond = roundCanvas * 0.900;
		var i, uv, angle;
		
		// 時
		this.context.beginPath();
		this.setColor("black");
		this.context.lineWidth = 8;
		angle = Math.PI * (this.dateNow.getHours() % 12 + this.dateNow.getMinutes() / 60) / 6;
		this.context.moveTo(this.centerX - Math.sin(angle) * roundHour / 4, this.centerY - -Math.cos(angle) * roundHour / 4);
		this.context.lineTo(this.centerX + Math.sin(angle) * roundHour,this.centerY + -Math.cos(angle) * roundHour);
		this.context.stroke();
		// 分
		this.context.beginPath();
		this.context.lineWidth = 4;
		angle = Math.PI * (this.dateNow.getMinutes() + this.dateNow.getSeconds() / 60) / 30;
		this.context.moveTo(this.centerX - Math.sin(angle) * roundMinute / 4, this.centerY - -Math.cos(angle) * roundMinute / 4);
		this.context.lineTo(this.centerX + Math.sin(angle) * roundMinute,this.centerY + -Math.cos(angle) * roundMinute);
		this.context.stroke();
		// 秒
		this.context.beginPath();
		this.context.lineWidth = 1;
		this.setColor("red");
		angle = Math.PI * this.dateNow.getSeconds() / 30;
		this.context.moveTo(this.centerX - Math.sin(angle) * roundSecond / 4, this.centerY - -Math.cos(angle) * roundSecond / 4);
		this.context.lineTo(this.centerX + Math.sin(angle) * roundSecond,this.centerY + -Math.cos(angle) * roundSecond);
		this.context.stroke();
    }
    
    //文字盤描画
    this.drawClockString = function (){
		// 変数宣言
		var offset1 = 90;
		var offset2 = 120;
		
		this.context.font = "italic 24px 'Times New Roman'";
		this.context.textAlign = "center";
		this.context.textBaseline = "middle";
		this.setColor("black");
		
		// 文字盤の描写
		this.context.fillText(this.formatYYYYMMDD(this.dateNow, "."), this.centerX, this.centerY + offset1);
		this.context.fillText(this.formatHHMMSS(this.dateNow, ":"), this.centerX, this.centerY + offset2);
    }
    
    //日付フォーマット
    this.formatYYYYMMDD = function (date, separator){
        var day = new Array();
		day[0] = ("0000" + date.getFullYear()).replace(/^.*(....)$/, "$1");
		day[1] = ("00" + (date.getMonth() + 1)).replace(/^.*(..)$/, "$1");
		day[2] = ("00" + date.getDate()).replace(/^.*(..)$/, "$1");
		day[3] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
		day[4] = "";
		return day.join(".");
    }
    
    //時間フォーマット
    this.formatHHMMSS = function (date, separator){
        var time = new Array();
		time[0] = ("00" + date.getHours()).replace(/^.*(..)$/, "$1");
		time[1] = ("00" + date.getMinutes()).replace(/^.*(..)$/, "$1");
		time[2] = ("00" + date.getSeconds()).replace(/^.*(..)$/, "$1");
		return time.join(":");
    }
}
