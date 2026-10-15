function TimeSlider(){
	this.x0 = 0;
	this.x1 = 1;
	this.amp = 1;
	
	this.dragging = false;
	this.draggingLeft = false;
	this.draggingRight = false;
	this.draggingCenter = false;
	
	this.overLeft = false;
	this.overRight = false;
	this.overCenter = false;
	
	this.xLDownDelta;
	this.xRDownDelta;
	
	addInteractionEventListener('mousedown', this.onMouse, this);
	addInteractionEventListener('mouseup', this.onMouse, this);
	addInteractionEventListener('mousewheel', this.onWheel, this);
}

TimeSlider.prototype.draw = function(){
	var frame = pool.frames.sliderFrame;
	
	if(this.draggingLeft){
		this.x0 = Math.min(Math.max((mX-frame.x)/frame.width, 0), 0.98);
		this.x1 = Math.min(Math.max(this.x1, this.x0+0.02), 1);
	} else if(this.draggingRight){
		this.x1 = Math.min(Math.max((mX-frame.x)/frame.width, 0.02), 1);
		this.x0 = Math.max(Math.min(this.x0, this.x1-0.02), 0);
	} else if(this.draggingCenter){
		this.x0 = Math.min(Math.max((mX-this.xLDownDelta)/frame.width, 0), 0.98);
		this.x1 = Math.min(Math.max((mX-this.xRDownDelta)/frame.width, 0.02), 1);
	}
	
	this.amp = this.x1-this.x0;
	
	var xL = frame.x + this.x0*frame.width;
	var xR = frame.x + this.x1*frame.width;
	
	setFill('rgba(0,0,0,0.5)');
	fRect(xL, frame.y, xR-xL, frame.height);
	
	this.overLeft = mY>frame.y && mY<frame.bottom && mX>xL-4 && mX<xL+4;
	this.overRight = mY>frame.y && mY<frame.bottom && mX>xR-4 && mX<xR+4;
	this.overCenter = mY>frame.y && mY<frame.bottom && mX>=xL+4 && mX<=xR-4;
	
	if(this.overLeft || this.overRight || this.overCenter) setCursor('pointer');
}

TimeSlider.prototype.onMouse = function(e){
	switch(e.type){
		case 'mousedown':
			if(this.overLeft){
				this.dragging = true;
				this.draggingLeft = true;
			} else if(this.overRight){
				this.dragging = true;
				this.draggingRight = true;
			} else if(this.overCenter){
				this.dragging = true;
				this.draggingCenter = true;
				this.xLDownDelta = mX - (sliderFrame.x + this.x0*sliderFrame.width);
				this.xRDownDelta = mX - (sliderFrame.x + this.x1*sliderFrame.width);
			}
			break;
		case 'mouseup':
			this.dragging = false;
			this.draggingLeft = false;
			this.draggingRight = false;
			this.draggingCenter = false;
			break;
	}
}

TimeSlider.prototype.onWheel = function(e){
	var cx = (this.x1+this.x0)*0.5;
	this.x0 = cx - (cx-this.x0)*(1+e.value*0.1);
	this.x1 = cx + (this.x1 - cx)*(1+e.value*0.1);
	this.x0 = Math.min(Math.max(this.x0, 0), cx-0.01);
	this.x1 = Math.min(Math.max(this.x1, cx+0.01), 1);
}

