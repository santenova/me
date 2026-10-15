function IconsTags(){
	this.frame;
	this.bigFrame;
	
	this.filterText = 'OR filter';
	
	this.mouseInside=false;
	this.pressed = false;
	this.activating;
	this.iOver;
	
	addInteractionEventListener('mousedown', this.onMouse, this);
	addInteractionEventListener('mouseup', this.onMouse, this);
}

IconsTags.prototype.onMouse = function(e){
	this.pressed = false;
	if(!this.mouseInside || e.type=='mouseup') return;
	this.pressed = true;
	
	if(this.iOver==null){
		if(mX<this.frame.getRight() && mY>this.frame.y-30){
			configuration.filterIconsType = (configuration.filterIconsType+1)%3;
			this.setFilterType();
		}
	} else {
		if(iconsActives.getSum()==iconsActives.length){
			iconsActives[this.iOver] = 1;
			for(var i=0; iconsNamesExtended[i]!=null; i++){
				if(i!=this.iOver) iconsActives[i]=0;
			}
		} else {
			iconsActives[this.iOver] = 1-iconsActives[this.iOver];
		}
		this.activating = iconsActives[this.iOver];
		if(iconsActives.getSum()==0){
			for(var i=0; iconsNamesExtended[i]!=null; i++){
				iconsActives[i]=1;
			}
		}
	}
	
	combineFilters();
}
IconsTags.prototype.setFilterType = function(){
	switch(configuration.filterIconsType){
		case 0:
			this.filterText = 'OR filter';
			break;
		case 1:
			this.filterText = 'AND filter';
			break;
		case 2:
			this.filterText = 'Exclusive filter';
			break;
	}
}

IconsTags.prototype.setFrame = function(frame){
	this.frame = frame;
	this.bigFrame = frame.clone();
	this.bigFrame.y-=25;
}

IconsTags.prototype.draw = function(){
	if(iconsImages.length==iconsNamesExtended.length) {
		
		this.mouseInside=this.bigFrame.containsPoint(mP);
		if(this.mouseInside) canvas.style.cursor = 'pointer';
		
		var dY = this.frame.height/(iconsNamesExtended.length+1);
		var s = 22;
		var y;
		var index;
		
		DrawTexts.setContextTextProperties('black', 12, LOADED_FONT);
		context.fillText(this.filterText, this.frame.x+50, this.frame.y-20);
		
		DrawTexts.setContextTextProperties('black', 12, LOADED_FONT);
		
		var previousOver = this.iOver;
		this.iOver = null;
		
		for(var i=0; iconsNamesExtended[i]!=null; i++){
			y = this.frame.y + (i+0.5)*dY;
			
			context.drawImage(iconsImages[i], this.frame.x+50, y -s*0.5, s, s);
			
			if(iconsActives[i]==0){
				context.fillStyle = 'rgba(255,255,255,0.8)';
				context.beginPath();
				context.arc(this.frame.x+50+s*0.5, y, s*0.5, 0, TwoPi);
				context.fill();
			}
			
			context.fillStyle = iconsActives[i]==0?'rgb(200,200,200)':'black';
			context.fillText(iconsNamesExtended[i], this.frame.x+s+54, y -6);
			
			context.fillStyle = 'rgb(200,200,200)';
			context.fillRect(this.frame.x + (1-tagsNumbers[i])*48, y-5.5, tagsNumbers[i]*48, 10);
			
			if(mY>this.frame.y+i*dY && mY<this.frame.y+(i+1)*dY) this.iOver = i;
			
		}
		
		if(this.pressed && (this.iOver!=previousOver)){
			iconsActives[this.iOver] = this.activating;
			combineFilters();
		}
	}
}
