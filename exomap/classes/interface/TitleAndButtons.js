function TitleAndButtons(){
	this.titletext = 'milky way from terran 4 '; //+VIEW.n;
	
	if(VIEW.magnitudesInterpolation && VIEW.distancesInterpolation){
		this.text0 = 'apparent magnitude';
		this.text1 = 'absolute magnitude';
	} else if(VIEW.magnitudesInterpolation){
		this.text0 = 'apparent magnitude';
		this.text1 = 'absolute magnitude';
	} else if(VIEW.distancesInterpolation){
		this.text0 = 'placed on sphere';
		this.text1 = 'actual positions';
	}
	
	DrawTexts.setContextTextProperties('black', 16, 'Times', null, null, 'italic');
	this.xTexts = context.measureText(this.text0).width+20;
	
	if(VIEW==view1){
		this.text2 = '<ehttp://santex.github.io/exomap/*http://santex.github.io/exomap/*s>';
	} else {
		this.text2 = '<ehttp://santex.github.io/exomap/*http://santex.github.io/exomap/*s>';
	}
	
	
	addInteractionEventListener('mouseup', onMouseUp, this);
	
	this.over0;
	this.over1;
	
	switch(VIEW.textsColor){
		case 'DARKGRAY':
			this.titleColor = 'rgb(100, 100, 100)';
			this.strongColor = 'rgb(30, 30, 30)';
			this.lightColor = 'rgb(150, 150, 150)';
			break;
		case 'WHITE':
			this.titleColor = 'rgb(255, 255, 255)';
			this.strongColor = 'rgb(255, 255, 255)';
			this.lightColor = 'rgb(150, 150, 150)';
			break;
  default:
			this.titleColor = 'rgb(100, 100, 100)';
			this.strongColor = 'rgb(30, 30, 30)';
			this.lightColor = 'rgb(150, 150, 150)';
			break;
	}
	
	this.textBoxBelow = new TextBox();
	this.textBoxBelow.font = 'Arial';
	this.textBoxBelow.fontSize = 12;
	this.textBoxBelow.fontColor = this.titleColor;//lightColor;
	this.textBoxBelow.width = 2000;
	this.textBoxBelow.lineWidth = 0.5;
	this.textBoxBelow.setText(this.text2);
}

onMouseUp = function(){
	if(this.over0 || this.over1){
		inter.start();
	}
}

TitleAndButtons.prototype.draw = function(){
	DrawTexts.setContextTextProperties(this.titleColor, 26, 'Times', null, null, 'italic');
	context.fillText(this.titletext, 20, 20);
	
	if(loading){
		var w = context.measureText(this.titletext).width;
		DrawTexts.setContextTextProperties(this.titleColor, 26, 'Times', null, null, 'italic');
		context.fillText('loading data…', 28+w, 33);
	}
	
	var color = ColorOperators.interpolateColors(this.strongColor, this.lightColor, inter.x);
	DrawTexts.setContextTextProperties(color, 12, 'Times', null, null, 'italic');
	context.fillText(this.text0, canvasWidth-this.xTexts, canvasHeight-90);
	color = ColorOperators.interpolateColors(this.lightColor, this.strongColor, inter.x);
	DrawTexts.setContextTextProperties(color, 12, 'Times', null, null, 'italic');
	context.fillText(this.text1, canvasWidth-this.xTexts, canvasHeight-110);
	
	var x0 = canvasWidth-this.xTexts-15;
	var y0 = canvasHeight-88;
	var y1 = canvasHeight-108;
	
	DrawTexts.setContextTextProperties(this.strongColor, 16, 'Times');
	if(inter.x==0) context.fillText('✔', x0, y0);
	if(inter.x==1) context.fillText('✔', x0, y1);
	this.over0 = !inter.x==0 && mouseY>y0 && mouseY<y0+20 && mouseX>x0;
	this.over1 = !inter.x==1 && mouseY>y1 && mouseY<y1+20 && mouseX>x0;
	
	this.textBoxBelow.x = 20;//canvasWidth - this.textBoxBelow.maxWidth - 5;
	this.textBoxBelow.y = 50//canvasHeight-18;
	this.textBoxBelow.draw();
	
	if(this.over0 || this.over1)  canvas.style.cursor = 'pointer'; 
}
  
x
