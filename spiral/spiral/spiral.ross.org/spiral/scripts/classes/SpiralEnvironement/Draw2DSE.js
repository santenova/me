drawUnits = function(){
	var i, j, k, l;
	var frame = pool.frames.tlProjectionFrame;
	var domains = pool.modelObjects.domains;
	var course, unit, le;
	var x0,x1,x,y;
	var wUnit;
	var dX = pool.frames.tlProjectionFrame.width/pool.modelObjects.grades.length;
	var dY = pool.frames.tlProjectionFrame.height/pool.modelObjects.domains.length;
	var dYU;
	
	var coursesMatrix = pool.tables.coursesMatrix;
	
	setStroke('black');
	
	for(i=0; coursesMatrix[i]!=null; i++){
		x0 = frame.x + i*dX;
		x1 = x0 + dX;
		for(j=0; coursesMatrix[0][j]!=null; j++){
			course = coursesMatrix[i][j];
			
			if(course==null) continue;
			
			y = frame.y + j*dY;
			
			if(i==0){
				setText('black', 14);
				fText(domains[j].id, 7, y+0.5*dY-7);
			}
			
			//setFill(course.domain.colorTransparent);
			//fRect(x0, y, dX-4, dY-4);
			
			setStroke(course.domain.color);
			setLW(0.5);
			line(x0+1, Math.floor(y+dY*0.5)+0.5, x1-2, Math.floor(y+dY*0.5)+0.5);
			
			x = x0;
			
			setFill('black');
			
			for(k=0; course.units[k]!=null; k++){
				unit = course.units[k];
				wUnit = (dX-4)*unit.duration/unit.course.unitsDuration;
				dYU = (dY-4)/unit.les.length;
				//line(x, y+2, x, y+dY-6);
				
				for(l=0; unit.les[l]; l++){
					le = unit.les[l];
					le.x = x+wUnit*l/unit.les.length;
					le.xGrade = le.iGrade + (l/unit.les.lengt)*(unit.duration/unit.course.unitsDuration);
					//c.log(le.grade.id, le.x);
					le.y = y+0.5*dY;// + (l+0.5)*dYU;
					//line(x+1, y + (l+0.5)*dYU, x+wUnit-2, y + (l+0.5)*dYU);
					if(fCircleM(le.x, le.y, 2.5)){
						line(projectionX(le.date_start), le.y, projectionX(le.date_finish), le.y);
						
						setText('black', 12);
						fText(le.id+"-"+le.unit.id+"-"+le.title, le.x, le.y-14);
					}
				}
				
				x+=wUnit;
			}
		}
	}
}


drawLes = function(){
	var i;
	var x0,x1,y;
	var dY = tlFrame.height/les.length;
	
	setFill('rgba(0,0,0,0.5)');
	for(i=0; les[i]!=null; i++){
		if(les[i].date_start!=null && les[i].date_finish!=null){
			x0 = projectionX(les[i].date_start);
			x1 = projectionX(les[i].date_finish);
			y = tlFrame.y + i*dY;
			fRect(x0-1, y, x1-x0+2, dY);
		}
	}
}

drawEcoMenBif = function(){
	var i;
	var x0,xC,x1;
	var y, yM;
	var mentalities = pool.modelObjects.mentalities;
	var ecologies = pool.modelObjects.ecologies;
	var bifurcations = pool.modelObjects.bifurcations;
	var ecology;
	//var n = pool.modelObjects.ecologies.length-1;
	


	///ecologies

	setStroke('black');
	setLW(0.5);
	
	for(i=0; ecologies[i]!=null; i++){
		x0 = Math.floor(projectionX(ecologies[i].date_start))+0.5;
		x1 = Math.floor(projectionX(ecologies[i].date_finish))+0.5;
		
		sRect(x0, pool.frames.ecoFrame.y+0.5, x1-x0, pool.frames.ecoFrame.height-1.5);
		line(x0, pool.frames.ecoFrame.y, x1, pool.frames.ecoFrame.bottom);
	}



	///mentalities
	
	setStroke('red');
	//n = mentalities.length-1;
	for(i=0; mentalities[i]!=null; i++){
		x0 = Math.floor(projectionX(mentalities[i].date_start))+0.5;
		xC = Math.floor(projectionX(mentalities[i].date_climax))+0.5;
		//x1 = Math.floor(projectionX(mentalities[i].date_finish))+0.5;
		//x1 = Math.floor(projectionX(CURRENT_YEAR))+0.5;
		x1 = Math.floor(projectionX(mentalities[i].date_finish)+cW*0.5)+0.5;

		y = pool.frames.menFrame.y+0.5;
		yM = Math.floor(pool.frames.menFrame.y + pool.frames.menFrame.height)+0.5;
		
		//sRect(x0, pool.frames.menFrame.y+0.5, x1-x0, pool.frames.menFrame.height-1.5);
		//line(x0, pool.frames.menFrame.y, x1, pool.frames.menFrame.bottom);
		
		setFill(Math.floor(255*i/(mentalities.length-1)),100,0,0.05);

		fsLines(
			x0, yM,
			xC, y,
			//x1, yM,
			x1, pool.frames.menFrame.bottom+0.5,
			x0, pool.frames.menFrame.bottom+0.5,
			x0, yM
		);
	}


	///bifurcations
	
	setStroke('magenta');
	//n = bifurcations.length-1;
	for(i=0; bifurcations[i]!=null; i++){
		x0 = Math.floor(projectionX(bifurcations[i].date_start))+0.5;
		//x1 = Math.floor(projectionX(bifurcations[i].date_finish))+0.5;
		//x1 = Math.floor(projectionX(CURRENT_YEAR))+0.5;
		
		//sRect(x0, pool.frames.bifFrame.y+0.5, x1-x0, pool.frames.bifFrame.height-1.5);
		sLines(
			x0, pool.frames.bifFrame.y,
			x0-5, pool.frames.bifFrame.bottom,
			x0+5, pool.frames.bifFrame.bottom,
			x0, pool.frames.bifFrame.y
		);
	}
}


drawCursor = function(){
	if(pool.frames.tlFrame.containsPoint(mP)){
		setText('black', 16, null, 'right');
		fText(Math.floor(projectionXInverse(mX)), mX-5, mY-18);
	}
}



// drawTimeLines = function(){
// 	var i;
// 	var x;
	
// 	setStroke('black');
	
// 	for(i=2; grades[i]!=null; i++){
// 		x = projectionX(grades[i].date_start);
// 		line(x, pool.frames.tlFrame.y, x, pool.frames.tlFrame.bottom);
// 	}
// }