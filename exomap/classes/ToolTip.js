drawToolTip = function(text, x, y){
	var x0, y0;

	setText('white', 10);
	var w = getTextW(text) + 10;
	var h = 30;

	x0 = x+w+20>cW?(cW-w-20):(x+20);
	y0 = (y>h+30)?(y-h-15):(y+15);

	setFill('rgb(80,80,80)');
	fRect(x0, y0, w, h);
	context.beginPath();
	Draw.drawArrowTriangle(new Point(0.6*x + 0.4*(x0+w*0.5), y0+h*0.5), new Point(x, y), 30);
	context.fill();

	setFill('white');
	fText(text, x0+5, y0+5);
}
