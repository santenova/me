drawSubmenus = function(){
	//drawMentalities();
	//drawTimeLineUnits();
	//drawViewOptions();
	//drawHelp();
	//c.l('      ++ drawSubmenus');
	drawZoomButtons(10,10);
}


drawRuler = function(){
	var W_TL = pool.viewParams.V_RULER;

	var xF = cW -  (pool.viewParams.RULER_STATE==2?2.5:pool.viewParams.RULER_STATE)*(W_TL-2);
	pool.viewParams.X_RULER = 0.8*pool.viewParams.X_RULER + 0.2*xF;
	var x0 = pool.viewParams.X_RULER;
	
	var i;
	var y0,xC, y;
	var dY;
	var grades = pool.modelObjects.grades;
	var prevP, p;
	var a;
	var num;
	var overArrow;

	var mouseOn = pool.frames.mouseInRuler = mX>x0 && mX<x0+W_TL;

	a = 13*TwoPi*(cH-4-mY)/(cH-4);
	var gradeIndex = Math.floor(a/TwoPi);

	if(mouseOn){
		setCursor('crosshair');

		//drawGrade( gradeIndex );
		//overObject(pool.modelObjects.grades[gradeIndex], true);

		overElementOnDrawing = pool.modelObjects.grades[gradeIndex];

		prevP = spiralFunctionSimple(a);
		prevP.x*=1.3;
		prevP.z*=1.3;
		prevP = pool.tD.e3D.projectCoordinates(prevP.x*pool.tD.scale, (prevP.y+pool.tD.yGrade)*pool.tD.scale, prevP.z*pool.tD.scale);
		prevP.x+=pool.frames.centerX;
		prevP.y+=pool.frames.centerY;

		p = spiralFunctionSimple(a);
		p.x*=1.5;
		p.z*=1.5;
		p = pool.tD.e3D.projectCoordinates(p.x*pool.tD.scale, (p.y+pool.tD.yGrade)*pool.tD.scale, p.z*pool.tD.scale);
		p.x+=pool.frames.centerX;
		p.y+=pool.frames.centerY;

		setLW(2);
		setStroke(0,0,0,1*prevP.z);
		line(prevP.x, prevP.y, p.x, p.y);
	}

	dY = (cH-4)/grades.length;
	var x1 = x0+W_TL-2;

	

	if(pool.objectsInteraction.overObject!=null && pool.objectsInteraction.overObject.type=='grade'){
		var iGrade = pool.modelObjects.grades.indexOf(pool.objectsInteraction.overObject);
		drawGrade(iGrade);
	}

	setFill('white');
	fRect(x0,-1,3*W_TL+2,cH+1);

	if(pool.objectsInteraction.overObject!=null && pool.objectsInteraction.overObject.type=='grade'){
		y0 = Math.floor(cH - 4 - (iGrade+1)*dY)+0.5;
		setFill('rgb(240,240,240)');
		fRect(x0,y0,x1-x0,dY);
	}

	overArrow = drawRulerCollapseButtons(x0);

	if(cW - x0 < 5) return;

	///grades
	
	pool.frames.tlProjectionFrame = new Rectangle(2,2,cH-4,W_TL);

	setLW(1);
	setStroke(0,0,0, 0.2);

	

	for(i=0; grades[i]!=null; i++){
		y0 = Math.floor(cH - 4 - i*dY)+0.5;
		if(i!=0) line(x0, y0,cW,y0);

		if(i!=0 && i!=1 && i!=2 && i!=12){
			setText('rgba(0,0,0,0.6)', 10, null, 'right');
			num = Math.floor(Math.round(projectionXInverse(2+i*dY)));
			num = num<0?((-num)+" BCE"):(num+" CE");
			fText(num, x0+W_TL-4, y0-14);
		}

		setText('rgba(0,0,0,0.15)', pool.frames.menFrame.height*0.4);
		fText(i==0?'K':i, x0+4, y0 - dY);
	}

	if(mouseOn && !overArrow && pool.viewParams.BEGINNER && mY>20){

		setStroke('black');
		line(x0, mY+0.5, x0+W_TL, mY+0.5);

		//help label
		if(pool.viewParams.BEGINNER && pool.interaction.nClicksOnRuler<2){
			setFill(0,0,0,0.2);
			fLines(
				x0-6, mY, 
				x0-20, mY-20,
				x0 - 100, mY-20,
				x0 - 100, mY + 20,
				x0 - 20, mY + 20
			);

			setText('white', 12, null, null, null, 'italic');
			fText('click or drag', x0 - 94, mY - 16);
			fText('to go to grade', x0 - 94, mY);
		}
	}

	if(pool.objectsInteraction.overObject && pool.objectsInteraction.overObject.angle!=null && pool.objectsInteraction.overObject.type!='grade'){
		y0 = Math.round( cH - 2 - dY*(-(-pool.objectsInteraction.overObject.angle-0.5*Math.PI + 0.5*Math.PI)/TwoPi) ) - 2.5;//+0.5;
		setStroke('black');
		line(x0, y0, x1, y0);
		setFill('black');
		fCircle(x0+W_TL*0.5, y0, 3);
	}

	if(mouseOn){
		
	}


	/// cursor

	if(mouseOn && (MOUSE_PRESSED || MOUSE_UP) && !overArrow){
		followAngle(-TwoPi*(cH- 2 - mY)/dY - HalfPi, false, pool.viewParams.ZOOM_ON_GRADE_FACTOR);
		pool.tD.angleBySelectedObject = false;
		//c.log('angle:', -TwoPi*(cH- 2 - mY)/dY - HalfPi);
	}

	if(mouseOn && MOUSE_UP && !overArrow) pool.interaction.nClicksOnRuler++;
	
	//following triangle over ruler
	if(pool.tD.following){
		setFill(0,0,0,0.3);

		y0 = cH - 2 - dY*pool.tD.iGrade - (pool.tD.angleBySelectedObject?3:0);

		//y1 = cH - 2 - dY*(-(pool.tD.angleDestiny + 0.5*Math.PI)/TwoPi);
		y1 = Math.round( cH - 2 - dY*(-(pool.tD.angleDestiny + 0.5*Math.PI)/TwoPi) ) - 2.5; //<-- adjusted Y position for triangle tip

		x= x0+W_TL*0.5;
		if(y1-y0>4){
			fLines(
				x0, y0+4,
				x,y1,
				x1,y0+4,
				x1,y0-4,
				x0,y0-4
			);
		} else if(y0-y1>4){
			fLines(
				x0, y0-4,
				x,y1,
				x1,y0-4,
				x1,y0+4,
				x0,y0+4
			);
		} else {
			fRect(x0, y0-4, W_TL-4, 8);
		}
	}



	if(cW - x0 < W_TL + 5) return;


	pool.frames.tlProjectionFrame = new Rectangle(0, 0, cH, 1.5*W_TL-pool.viewParams.W_ECOLOGIES);

	if(mX>x1) pool.objectsInteraction.overObjectOnFrame = null;



	var buttonText = pool.viewParams.MENTALITIES?"⥁ click to open Units":"⥁ click to open Ecologies and Mentalities";//"⥁ toggle"

	setText('rgb(140,140,140)', 14);

	overUnitsEcoToggleButton = fTextRotatedM(buttonText, x1+10, cH - 10, -HalfPi);

	pool.interaction.oveInterfaceButton = pool.interaction.oveInterfaceButton||overUnitsEcoToggleButton;

	if(overUnitsEcoToggleButton){
		setCursor('pointer');

		setFill(0,0,0,0.2);
		fLines(
			mX-6, mY, 
			mX-16, mY-10,
			mX - 100, mY-10,
			mX - 100, mY + 10,
			mX - 16, mY + 10
		);

		setText('white', 12, null, null, null, 'italic');
		fText('click to toggle', mX - 94, mY - 8);

		if(MOUSE_UP) pool.viewParams.MENTALITIES = !pool.viewParams.MENTALITIES;
	}

	context.save();
	context.translate(x1,cH);
	context.rotate(-HalfPi);


	var w = cW-x1;

	//drawEcologiesOnRuler(x1);
	

	if(pool.viewParams.MENTALITIES){
		pool.frames.tlProjectionFrame = new Rectangle(0, W_TL*1.5-pool.viewParams.W_ECOLOGIES, cH, 0);
		var overEco = drawEcologiesOnRuler(cW-pool.viewParams.W_ECOLOGIES);

		//drawMentalitiesOnRuler(x1);
		pool.frames.tlProjectionFrame = new Rectangle(0, 0, cH, 1.5*W_TL-pool.viewParams.W_ECOLOGIES);
		var overMent = drawMentalitiesOnRuler(x1-pool.viewParams.W_ECOLOGIES, overEco);

		if(overMent==null && overEco!=null){
			//overObject(overEco);
			overElementOnDrawing = overEco;
			setCursor('pointer');
			if(MOUSE_DOWN){
				selectObject(overEco);
			}
		}

		context.restore();

	} else {
		context.restore();

		pool.frames.tlProjectionFrame = new Rectangle(x1+10, 0, w-10, cH);

		drawUnitsOnRuler();
	}

}

drawEcologiesOnRuler = function(xL){
	var i;
	var x0, x1;
	var ecologies = pool.modelObjects.ecologies;
	var frame = pool.frames.tlProjectionFrame;

	var mX2 = cH - mY;

	var overEco;

	y = frame.x;

	for(i=0; ecologies[i]!=null; i++){
		x0 = Math.floor(projectionX(ecologies[i].date_start))+0.5;
		x1 = Math.floor(projectionX(ecologies[i].date_finish))+0.5;

		if(pool.frames.mouseInCanvas && mX>xL-pool.viewParams.V_RULER && mX<xL+pool.viewParams.W_ECOLOGIES && mX2>x0 && mX2<=x1){
			//overEco = {x:x1, title:ecologies[i].title};


			overEco = ecologies[i];

			// overObject(ecologies[i]);
			// setCursor('pointer');
			// if(MOUSE_DOWN){
			// 	selectObject(ecologies[i]);
			// }

			setFill(0, 0, 0, 0.8);
		} else {
			setFill(0, 0, 0, 0.3);
		}

		//fRect(Math.ceil(x0)+1, frame.y, Math.floor(x1-x0)-1, pool.viewParams.W_ECOLOGIES);//frame.height);
		fRectSkewed(Math.ceil(x0)+1, frame.y, Math.floor(x1-x0)-1, pool.viewParams.W_ECOLOGIES, 10);
	}

	return overEco;
}

fRectSkewed = function(x, y, w, h, s){
	fLines(
		x+s,y,
		x+w+s,y,
		x+w-s,y+h,
		x-s,y+h,
		x+s,y
	);
}

var lastMentality;

drawMentalitiesOnRuler = function(x1, overEco){
	_drawIntervalsFlowTableVertical(pool.tables.mentalitiesFlowIntervals, pool.tables.mentalitiesFlowIntervals.colors, true, 0.3, pool.tables.mentalitiesDates);

	if(mX>x1 && mX<cW-pool.viewParams.W_ECOLOGIES){

		var rgbs = [];
		pool.tables.mentalitiesFlowIntervals.colors.forEach(function(col){
			rgbs.push(ColorOperators.HEXtoRGB(col).join(','));
		});

		var i;
		var mentality;
		var color = getPixelColorRGBA(mX, mY);
		
		if(pool.frames.mouseInCanvas && (color[0]!=255 || color[1]!=255 || color[2]!=255)){
			color = color[0]+','+color[1]+','+color[2];
			for(i = 0; rgbs[i]!=null; i++){
				if(rgbs[i]==color){
					overElementOnDrawing = lastMentality = mentality = pool.modelObjects.mentalities[i];
					break;
				}
			}

			if(overElementOnDrawing==null || overElementOnDrawing.type!='mentality'){
				mentality = overElementOnDrawing = lastMentality;
			}
		}
	}

	if(mentality){
		setCursor('pointer');
		if(MOUSE_DOWN){
			selectObject(mentality);
		}
	}



	return mentality;
}

drawUnitsOnRuler = function(){
	//var mouseOn = _drawMenuBackground(1, x0, pool.submenus.timelineUnits) && x0<cH-pool.viewParams.H_MENUS;
	//if(x0>cH-2) return;

	var i, j, k;
	var course, unit;
	var domains = pool.modelObjects.domains;
	var y0,y1,x,y;
	var yBottom = pool.frames.tlProjectionFrame.getBottom();
	var x0 = pool.frames.tlProjectionFrame.x+pool.viewParams.W_ECOLOGIES;
	
	var hUnit;
	var dY = (pool.frames.tlProjectionFrame.height-4)/pool.modelObjects.grades.length;
	var dX = (pool.frames.tlProjectionFrame.width-pool.viewParams.W_ECOLOGIES)/(pool.modelObjects.domains.length-3);
	var coursesMatrix = pool.tables.coursesMatrix;
	var overUnit;
	
	//setFill('white');
	//fRect(pool.frames.frame.x-2, x0 - 2, pool.frames.frame.width+4, pool.viewParams.H_MENUS+4);

	setLW(2);
	setStroke('black');


	var hardCodedDomainsIndexes = [0, 8, 1, 2, 3, 4, 5, 6, 7];


	for(i=0; coursesMatrix[i]!=null; i++){
		//y0 = yBottom - i*dY;
		//y1 = y0 - dY;
		for(j=0; j<hardCodedDomainsIndexes.length; j++){
			course = coursesMatrix[i][hardCodedDomainsIndexes[j]];
			//course = coursesMatrix[i][j];
			//
			if(course==null || course.units.length==0){
				//setFill(230, 230, 230);
				//fRect(x, cH - y0, dX-2, -(dY-2));
				continue;
			}
			
			x = x0 + j*dX;

			//y0 = pool.frames.frame.x + i*dY;
			y0 = i*dY + 5;

			

			//setFill(course.domain.colorTransparent);

			for(k=0; course.units[k]!=null; k++){
				unit = course.units[k];
				
				//setFill(unit.rls==null?course.domain.colorTransparent:'black');
				setFill(unit.color);

				hUnit = (dY-2)*unit.duration/unit.course.unitsDuration;

				if(fRectM(x, cH - y0-(hUnit-2), dX-2, (hUnit-2))){
					setCursor('pointer');
					overUnit = unit;
				}

				//if(overUnit == unit || pool.objectsInteraction.selectedObject == unit){
				if(pool.objectsInteraction.overObject == unit || pool.objectsInteraction.selectedObject == unit){
					sRect(x, cH - y0, dX-2, -(hUnit-2));
				}

				y0+=hUnit;

			}
		}
	}

	if(overUnit!=null){
		//overObject(overUnit);
		overElementOnDrawing = overUnit;
	}
}

drawRulerCollapseButtons = function(x0){
	if(pool.isTouch) return;

	var overA = drawCollapseArrow(x0 - 14, 12.5, pool.viewParams.RULER_STATE>0);
	var overB = drawCollapseArrow(x0 + pool.viewParams.V_RULER - 14, 12.5, pool.viewParams.RULER_STATE!=1);

	if(MOUSE_UP){
		if(overA){
			if(pool.viewParams.RULER_STATE==0){
				pool.viewParams.RULER_STATE=1;
			} else {
				pool.viewParams.RULER_STATE--;
			}
			writeCookie();
		} else if(overB){
			if(pool.viewParams.RULER_STATE==1){
				pool.viewParams.RULER_STATE=2;
			} else {
				pool.viewParams.RULER_STATE=1;
			}
			writeCookie();
		}
	}

	if(overA||overB) pool.frames.mouseInCanvas = false;

	return overA||overB;
}
drawCollapseArrow = function(x,y,right){
	setStroke('rgb(180,180,180)', 2);
	if(right){
		line(x-9, y, x+4,y);
		sLines(x, y-4, x+4, y, x, y+4);
	} else {
		line(x+9, y, x-4,y);
		sLines(x, y-4, x-4, y, x, y+4);
	}
	var over = Math.pow(mX-x, 2)+Math.pow(mY-y, 2)<100;
	if(over) setCursor('pointer');
	return over;
}

drawTimeLineUnits = function(){
	var y0 = pool.submenus.timelineUnits.y;
	var mouseOn = _drawMenuBackground(1, y0, pool.submenus.timelineUnits) && y0<cH-pool.viewParams.H_MENUS;
	if(y0>cH-2) return;

	var i, j, k;
	var course, unit;
	var domains = pool.modelObjects.domains;
	var x0,x1,x,y;
	
	var wUnit;
	var dX = pool.frames.frame.width/pool.modelObjects.grades.length;
	var dY = pool.viewParams.H_MENUS/pool.modelObjects.domains.length;
	var coursesMatrix = pool.tables.coursesMatrix;
	var overUnit;
	

	setFill('white');
	fRect(pool.frames.frame.x-2, y0 - 2, pool.frames.frame.width+4, pool.viewParams.H_MENUS+4);

	setLW(2);
	setStroke('black');

	for(i=0; coursesMatrix[i]!=null; i++){
		x0 = pool.frames.frame.x + i*dX;
		x1 = x0 + dX;
		for(j=0; coursesMatrix[0][j]!=null; j++){
			course = coursesMatrix[i][j];
			
			y = y0 + j*dY;

			x0 = pool.frames.frame.x + i*dX;

			if(course==null || course.units.length==0){
				setFill(230, 230, 230);
				fRect(x0, y, dX-2, dY-2);
				continue;
			}

			setFill(course.domain.colorTransparent);

			for(k=0; course.units[k]!=null; k++){
				unit = course.units[k];
				wUnit = (dX-2)*unit.duration/unit.course.unitsDuration;

				if(fRectM(x0, y, wUnit-2, dY-2)){
					setCursor('pointer');
					overUnit = unit;
				}

				if(overUnit == unit || pool.objectsInteraction.selectedObject == unit){
					sRect(x0, y, wUnit-2, dY-2);
				}

				x0+=wUnit;

			}
		}
	}

	if(mouseOn && overUnit!=null){
		overObject(overUnit);
	}
	

}

drawViewOptions = function(){
	var y0 = pool.submenus.viewOptions.y;
	_drawMenuBackground(2, y0, pool.submenus.viewOptions);
	if(y0>cH-2) return;

	var i;
	var x = pool.frames.frame.x + 10;

	setText('white', 16, null, null, null, 'italic');

	for(i=0; pool.submenus.viewOptions.options[i]!=null; i++){
		x+=_viewButton(pool.submenus.viewOptions.options[i], x, y0+10)+26;
	}

}


drawHelp = function(){
	var y0 = pool.submenus.help.y;
	_drawMenuBackground(3, y0, pool.submenus.help);
	
	if(y0>cH-2) return; /////// -----> if not visible the function stops here (to not draw unnecesarily) you can change this

	setFill('white');
	fRect(pool.frames.frame.x-2, y0 - 2, pool.frames.frame.width+4, pool.viewParams.H_MENUS+4);

	/*
	/ Dani: contents here
	/ the area to draw is defined by the rectangle pool.frames.frame.x, y0, pool.frames.frame.width, pool.viewParams.H_MENUS
	*/

}

//var pool.interaction.oveInterfaceButton = false;

drawZoomButtons = function(x, y){
	pool.interaction.oveInterfaceButton = false;
	var over = drawZButtonBase(x, y, "overview");
	pool.isTouch?drawImage(pool.loading.minSpiralImage, x, y+2, 36, 30):drawImage(pool.loading.minSpiralImage, x, y+2);
	
	if(over && MOUSE_UP){
		followAngle(-12.5*TwoPi, true);
	}

	if(MOUSE_UP){
		c.l('     [d] drawZoomButtons, MOUSE_UP=true, over (overview):', over);
	}

	pool.interaction.oveInterfaceButton = over;

	over = drawZButtonBase(x, y+20+(pool.isTouch?18:0), "zoom in");

	if(over && MOUSE_UP) zoomStep(true);
	pool.interaction.oveInterfaceButton = pool.interaction.oveInterfaceButton||over;

	//c.l('-');
	over = drawZButtonBase(x, y+40+(pool.isTouch?36:0), "zoom out");
	//c.l('3 over', over);
	//c.l('over, MOUSE_UP', over, MOUSE_UP);
	//
	

	
	if(over && MOUSE_UP) zoomStep(false);
	pool.interaction.oveInterfaceButton = pool.interaction.oveInterfaceButton||over;

	setFill('white');
	if(pool.isTouch){
		fRect(x + 14, y + 42, 8, 28);
		fRect(x + 4, y + 52, 28, 8);

		fRect(x + 4, y + 91, 28, 8);
	} else {
		fRect(x + 7, y + 22, 4, 14);
		fRect(x + 2, y + 27, 14, 4);

		fRect(x + 2, y + 47, 14, 4);
	}
}

drawZButtonBase = function(x, y, message){
	setFill(200,200,200);

	context.beginPath();
	pool.isTouch?Draw.drawRoundRect(x, y, 36, 36, 4):Draw.drawRoundRect(x, y, 18, 18, 4);
	context.fill();
	var over = pool.isTouch?
		mX>x-2 && mX<x+48 && mY>y-1 && mY<y+38
		:
		mX>x && mX<x+18 && mY>y && mY<y+18;

	if(over && !pool.isTouch){
		setCursor('pointer');
		if(pool.viewParams.BEGINNER){
			setFill(0,0,0,0.2);

			fLines(
				x+20, y+9, 
				x+28, y-1,
				x+90, y-1,
				x+90, y+19,
				x+28, y+19
			);

			setText('white', 12, null, null, null, 'italic');
			fText(message, x + 30, y+1);
		}
	}
	return over;
}

//////

_viewButton = function(option, x, y){
	var val = pool.viewParams[option.varName];
	var text = option.name + (val?' ✔':'');
	var w = getTextW(text);
	var over = fTextM(text, x, y);
	if(over) setCursor('pointer');
	if(over && NF_UP==nF) pool.viewParams[option.varName] = !val;
	if(option.varName=="DRAW_LES"){
		pool.modelObjects.les.applyFunction(function(le){le.visible=false});
	}
	return w;
}

_drawMenuBackground = function(nTab, y0, submenu){
	var x = nTab*130;
	setFill(190,190,190);
	var mouseOn = fRectM(pool.frames.frame.x-5, y0 - 5, pool.frames.frame.width+10, pool.viewParams.H_MENUS+10);
	var mouseOnTab = fRectM(pool.frames.frame.x-5 + x, y0 - 20, 120, 15);
	//setFill('white');
	//fCircle(pool.frames.frame.x+5+x, y0-10, 5);

	setText('white', 12, null, null, null, 'bold');
	fText(submenu.title, pool.frames.frame.x+x+2, y0-18);

	if(mouseOnTab) setCursor('pointer');

	if(mouseOnTab && NF_FASTUP==nF){
		submenu.open = !submenu.open;
		if(submenu!=pool.submenus.viewOptions) pool.submenus.viewOptions.open = false;
		if(submenu!=pool.submenus.timeline) pool.submenus.timeline.open = false;
		if(submenu!=pool.submenus.timelineUnits) pool.submenus.timelineUnits.open = false;
		if(submenu!=pool.submenus.help) pool.submenus.help.open = false;
	}

	if(submenu.open){
		submenu.y = 0.8*submenu.y + 0.2*(cH - pool.viewParams.H_MENUS-30);
	} else {
		submenu.y = 0.8*submenu.y + 0.2*(cH+2);
	}

	return mouseOn;
}



////


_drawIntervalsFlowTableVertical = function(intervalsFlowTable, colors, bezier, offValue, years){//, returnHovered){ //TODO: implement rollover detection, using _isOnShape (below)
	//frame = frame==null?new Rectangle(10, 10, 400, 300):frame;
	colors = colors==null?ColorListGenerators.createCategoricalColors(0, intervalsFlowTable.length, ColorScales.temperature):colors;
	bezier = bezier||false;
	offValue = offValue==null?0.45:offValue;

	

	var frame = pool.frames.tlProjectionFrame;
	
	var nElements = intervalsFlowTable.length;
	var i;
	var j;
	
	var nCols = intervalsFlowTable[0].length;
	var dX = frame.width/(nCols-1);
	var dY = frame.height;
	
	var point;
	
	var intervalList;
	var lastIntervalList = intervalsFlowTable[nElements-1];
	var sY = 0;
	var mY = 0;
	var x = frame.x;
	var y = frame.y;
	
	var prevPoint;
	var prevYsup;
	var prevsY;
	var newYsup;
	
	var offX;
	


	//var nHovered = -1;
	//
	
	for(i=0; intervalsFlowTable[i]!=null; i++){
		intervalList = intervalsFlowTable[i];
		
		context.fillStyle = colors[i];
		//setStroke(colors[i], 1);
		context.beginPath();
		
		sY = y;
		
		point = new Point(x, intervalList[0].y*dY+sY);
		context.moveTo(point.x, point.y);
		
		prevPoint = point;
		
		for(j=1;j<nCols;j++){
			sY = y;
			
			//point = new Point(j*dX+x, intervalList[j].y*dY+sY);
			point = new Point(projectionX(years[j]), intervalList[j].y*dY+sY);
			

			if(bezier){
				offX = (point.x-prevPoint.x)*offValue;
				context.bezierCurveTo(prevPoint.x+offX, prevPoint.y, point.x-offX, point.y, point.x, point.y);
			} else {
				context.lineTo(point.x, point.y);
			}
			
			prevPoint = point;
		}
		
		//point = new Point((nCols-1)*dX+x, intervalList[nCols-1].x*dY+sY);
		point = new Point(projectionX(years[nCols-1]), intervalList[nCols-1].x*dY+sY);
		context.lineTo(point.x, point.y);
		prevPoint = point;

		for(j=nCols-2;j>=0;j--){
			sY = y;
			
			//point = new Point(j*dX+x, intervalList[j].x*dY+sY);
			point = new Point(projectionX(years[j]), intervalList[j].x*dY+sY);
			
			if(bezier){
				offX = (point.x-prevPoint.x)*offValue;
				context.bezierCurveTo(prevPoint.x+offX, prevPoint.y, point.x-offX, point.y, point.x, point.y);
				
				// if(returnHovered && nHovered==-1 && IntervalTableDraw._isOnShape(prevPoint, point, intervalList[j-1].y*dY+sY, intervalList[j].y*dY+sY, offX, mX, mY)){
					// nHovered = i;
				// }
				
			} else {
				context.lineTo(point.x, point.y);
			}
			
			prevPoint = point;
		}
		
		point = new Point(x, intervalList[0].x*dY+sY);
		context.lineTo(point.x, point.y);
		
		context.fill();
		//context.stroke();
		
		
	}
}
