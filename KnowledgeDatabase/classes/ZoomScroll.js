function ZoomScroll(){
	this.x;
	this.y;
	
	this.width = 200;
	
	this.t = q/20;
	
	this.mouseOn;
	
	this.dragDetection = new DragDetection(0, this.dragging, this, this.areaVerificationFunction);
	
	this.inactive = false;
}


ZoomScroll.prototype.draw = function(){
	if(this.inactive) return;
	
	context.strokeStyle = 'black';
	context.lineWidth = 1;
	
	context.beginPath();
	context.moveTo(this.x, this.y);
	context.lineTo(this.x+this.width, this.y);
	context.stroke();
	
	context.fillStyle = 'rgb(100,100,100)';
	context.beginPath();
	context.arc(this.x + this.t*this.width, this.y, 4, 0, TwoPi);
	context.fill();
	
	DrawTexts.setContextTextProperties('rgb(150,150,150)', 12, LOADED_FONT);
	context.fillText('zoom (try wheel)', this.x, this.y - 18);
	
	this.mouseOn = this.mouseOnScroll();
	if(this.mouseOn) canvas.style.cursor = 'pointer';
}


ZoomScroll.prototype.mouseOnScroll = function(){
	return mY>this.y-4 && mY<this.y+4 && mX>this.x-4 && mX <this.x+this.width+4;
}


ZoomScroll.prototype.dragging = function(){
	this.t = Math.max(Math.min((mX-this.x)/this.width, 1), 0);
	
	q = this.t*20;
	q2 = q+1;
	
	follow_mX = cX;//0.9*follow_mX + 0.1*0;
	follow_mY = cY;//0.9*follow_mY + 0.1*cH;
}
ZoomScroll.prototype.areaVerificationFunction = function(){
	return this.mouseOn;
}