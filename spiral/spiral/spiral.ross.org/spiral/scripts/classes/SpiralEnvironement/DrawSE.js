var overElementOnDrawing;
var prevMouseInCanvas;

draw = function(){

	//stopCycle();
	//a.push(0);

	overElementOnDrawing = null;

	spiralMovement();
	pool.objectsInteraction.nonNeutralObjectSelected = pool.objectsInteraction.selectedObject!=null && !pool.objectsInteraction.selectedObject.neutral;

	if(pool.isTouch){
		drawTouch();
	} else {
		drawComputer();
	}

	if(overElementOnDrawing && pool.frames.mouseInCanvas){
		var showToolTip = overElementOnDrawing.type != 'thread' && overElementOnDrawing.type != 'grade';
		overObject(overElementOnDrawing, !showToolTip);
	} else {
		if(pool.frames.mouseInCanvas) unOverObject();
		//c.l('-');
	}

	if(prevMouseInCanvas && !pool.frames.mouseInCanvas){ c.l('yup'); unOverObject();}
	prevMouseInCanvas = pool.frames.mouseInCanvas;
}

var prevMoving = false;

drawTouch = function(){

	if(pool.spiralMoving){
		//c.l('--moving');
		clearContext();
		drawTouchSimple();
		//c.l('  ==> call drawSubmenus');
		drawSubmenus();
		drawRuler();
	}

	prevMoving = pool.spiralMoving;
}



var singletonDomains;

drawTouchSimple = function(){
	if(singletonDomains==null)  singletonDomains = pool.modelObjects.domains.slice(0,1);
	var prevDomains = pool.modelObjects.domains.clone();
	//pool.modelObjects.domains = pool.modelObjects.domains.slice(0,1);
	drawDomains(singletonDomains);
	drawLEsOnSpiralTouch();
	//pool.modelObjects.domains = prevDomains;
}

drawTouchComplete = function(){
	//c.log('++ drawTouchComplete');
	overElementOnDrawing = null;

	pool.objectsInteraction.nonNeutralObjectSelected = pool.objectsInteraction.selectedObject!=null && !pool.objectsInteraction.selectedObject.neutral;

	clearContext();
	drawComputer();

	console.log('\n\n*** overElementOnDrawing:',overElementOnDrawing);

	if(overElementOnDrawing) overObject(overElementOnDrawing, true);

}

drawComputer = function(){
	clearContext();

	if(pool.viewParams.DRAW_DOMAINS) drawDomains();
	if(pool.viewParams.DRAW_LES) drawLEsOnSpiral();
	//if(pool.viewParams.DRAW_GRADES) drawGrades();
	var overLE = overElementOnDrawing!=null;
	if(pool.viewParams.DRAW_THREADS) drawThreads(overLE);
	if(pool.viewParams.DRAW_INTEGRATIONS) drawIntegrations();
	//c.l('  ==> call drawSubmenus');
	drawSubmenus();
	drawRuler();
}


drawDomains = function(domains){
	var CUT_SUBDOMAINS_DOMAINS = 3; //transitory measure to remove last 3 domains 


	var T = new Date().getTime();


	var domains = domains==null?pool.modelObjects.domains:domains;
	var domain;
	var N_PERIODS = pool.modelObjects.grades.length;
	var i, j;
	var prevP, p;
	var offset;
	var offsetFactor = TwoPi/(domains.length-CUT_SUBDOMAINS_DOMAINS);
	//var offsetFactor = TwoPi/(domains.length-1);
	var N_STEPS = N_PERIODS*pool.spiral.N_STEPS_PER_PERIOD;
	var dA = TwoPi/pool.spiral.N_STEPS_PER_PERIOD;
	var t;

	var centerX = pool.frames.centerX;
	var centerY = pool.frames.centerY;

	var lT = -10;
	var lB = cH+10;
	var lL = -10;
	var lR = cW+10;

	var overDomain;
	var fullVisible;

	var limitScale;

	var selected;

	var prevpz;

	var color;
	var rgb;

	var prevDrawSegment, drawSegment = true;

	for(i=0; domains[i+CUT_SUBDOMAINS_DOMAINS]!=null; i++){
		limitScale = (i==0)?pool.spiral.LIMIT_SCALE_DOMAINS*0.15:pool.spiral.LIMIT_SCALE_DOMAINS

		domain = domains[i];
		offset = i*offsetFactor;
		//pool.spiral.RADIAL_FACTOR = i==0?0:0.05;
		prevP = spiralFunction(N_STEPS*dA, offset);
		prevP = pool.tD.e3D.projectCoordinates(prevP.x*pool.tD.scale, (prevP.y+pool.tD.yGrade)*pool.tD.scale, prevP.z*pool.tD.scale);
		prevP.x+=centerX;
		prevP.y+=centerY;

		//selected = pool.objectsInteraction.selectedObject.domain==domain || (pool.objectsInteraction.selectedObject.isSubDomain && pool.objectsInteraction.selectedObject.domain == domain)

		fullVisible = 
			(!pool.objectsInteraction.nonNeutralObjectSelected ||  
				(pool.objectsInteraction.selectedObject!=null && 
					pool.objectsInteraction.selectedObject.domain==domain) || 
				(pool.objectsInteraction.selectedObject!=null && 
					pool.objectsInteraction.selectedObject.domain!=null &&
					pool.objectsInteraction.selectedObject.domain.domain == domain) || 
				pool.objectsInteraction.selectedObject==domain
				)
			
		fullVisible = fullVisible && 
			(
				pool.objectsInteraction.overObject==null || 
				pool.objectsInteraction.overObject.type!='domain' || 
				pool.objectsInteraction.overObject==domain ||
				(pool.objectsInteraction.overObject.domain!=null && pool.objectsInteraction.overObject.domain==domain) || 
				(pool.objectsInteraction.overObject!=null && 
					pool.objectsInteraction.overObject.domain!=null &&
					pool.objectsInteraction.overObject.domain.domain == domain)
			)
		
		
		color = fullVisible?domain.color:domain.colorTransparent;
		rgb = domain.rgb;
		setStroke(color);
		
		inerloop:
		for(j=N_STEPS-1; j>=0; j--){
			t = j*dA;
			p = spiralFunction(t, offset);
			p = pool.tD.e3D.projectCoordinates(p.x*pool.tD.scale, (p.y+pool.tD.yGrade)*pool.tD.scale, p.z*pool.tD.scale);
			

			prevpz = p.z;

			p.z *= (pool.tD.scale*rFromAngle(t)*0.004);

			p.x+=centerX;
			p.y+=centerY;

			if(p.z>0 && p.z<limitScale) break inerloop;

			//prevDrawSegment = drawSegment;
			drawSegment = p.z>limitScale && prevP.z>limitScale && prevpz>pool.spiral.LIMIT_REALSCALE && ((p.x>lL && p.x<lR && p.y>lT && p.y<lB) || (prevP.x>lL && prevP.x<lR && prevP.y>lT && prevP.y<lB));
			drawSegment = drawSegment &&  !(prevpz<pool.spiral.LIMIT_REALSCALE_ALPHA && !fullVisible);

			if(drawSegment){

				// if(!prevDrawSegment){
				// 	context.moveTo(p.x, p.y);
				// } else {

					setStroke( 
						prevpz<pool.spiral.LIMIT_REALSCALE_ALPHA? 
							'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+( (prevpz-pool.spiral.LIMIT_REALSCALE)/pool.spiral.LIMIT_REALSCALE_AMP )+')' 
							:
							color
					);

					context.lineWidth = (fullVisible?p.z:p.z*0.5)*pool.spiral.DOMAINS_WIDTH;
					
					context.beginPath();
					context.moveTo(prevP.x, prevP.y);
					context.lineTo(p.x, p.y);
					context.stroke();
				//}

			}

			prevP = p;
		}
	}
}

drawLEsOnSpiral = function(){
	var i, j, k, l;
	var course, unit, le;
	var t, r;
	var x, wUnit;
	var p, pPrev;
	var angle;
	var domains = pool.modelObjects.domains;
	var coursesMatrix = pool.tables.coursesMatrix;
	var selected, over;
	var onSelectedThread;

	var centerX = pool.frames.centerX;
	var centerY = pool.frames.centerY;

	var leIsSelected = pool.objectsInteraction.selectedObject!=null && pool.objectsInteraction.selectedObject.type=='le';//move this to global (pool.objectsInteraction)
	var integrationIsSelected = pool.objectsInteraction.selectedObject!=null && pool.objectsInteraction.selectedObject.type=='integration';
	
	var highlighted;

	var objOverOrSelected = pool.objectsInteraction.overObject==null?pool.objectsInteraction.selectedObject:pool.objectsInteraction.overObject;
	var rOver;

	setStroke('black');

	var overArray = [];

	var threadSelected = pool.objectsInteraction.selectedObject!=null && pool.objectsInteraction.selectedObject.type == "thread";
	
	for(i=0; coursesMatrix[i]!=null; i++){
		for(j=0; j<coursesMatrix[i].length; j++){
			course = coursesMatrix[i][j];
			
			if(course==null) continue;
			
			angle = TwoPi*j/domains.length;
			
			x = 0;
			for(k=0; course.units[k]!=null; k++){
				unit = course.units[k];
				wUnit = unit.duration/unit.course.unitsDuration;
				pPrev = null;
				
				for(l=0; unit.les[l]; l++){
					le = unit.les[l];
					
					selected = pool.objectsInteraction.selectedObject==le;
					
					// highlighted = !pool.objectsInteraction.nonNeutralObjectSelected||selected||(pool.objectsInteraction.selectedObject!=null && pool.objectsInteraction.selectedObject.les!=null && pool.objectsInteraction.selectedObject.les.indexOf(le)!=-1);
					// highlighted = highlighted || (le.domain.domain == pool.objectsInteraction.selectedObject);
					// highlighted = highlighted || (pool.currentThread!=null && pool.currentThread.les.indexOf(le)!=-1);
					

					//highlighted = !pool.objectsInteraction.nonNeutralObjectSelected||selected||(objOverOrSelected!=null && objOverOrSelected.les!=null && objOverOrSelected.les.indexOf(le)!=-1);
					highlighted = selected || (objOverOrSelected!=null && objOverOrSelected.les!=null && objOverOrSelected.les.indexOf(le)!=-1);
					highlighted = highlighted || (le.domain.domain == objOverOrSelected);
					highlighted = highlighted || pool.objectsInteraction.overObject == le;
					highlighted = highlighted || !objOverOrSelected;
					//highlighted = highlighted || (pool.currentThread!=null && pool.currentThread.les.indexOf(le)!=-1);

					//if(le.domain.domain) c.l('le.domain.domain', le.domain.domain);
					
					setFill(highlighted?le.color:'rgba(0,0,0,0.3)');

					p = le.p3D;
					p = pool.tD.e3D.projectCoordinates(p.x*pool.tD.scale, (p.y+pool.tD.yGrade)*pool.tD.scale, p.z*pool.tD.scale);
					prevpz = p.z;
					//rOver = 
					p.z = p.z*pool.tD.scale*le.size//*rFromAngle(t);//*(highlighted?1:0.6);//rFromAngle(t)*0.006;
					le.visible = p.z>pool.spiral.LIMIT_SCALE_LES  && prevpz>pool.spiral.LIMIT_REALSCALE   // && p.x+centerX>-5 && p.x+centerX<pool.viewParams.X_RULER+5 && p.y+centerY>-5 && p.y+centerY<cH+5;
					
					
					if(le.visible){
						if(pool.viewParams.DRAW_UNITS){
							if(pPrev!=null){
								setLW(3.5*(pPrev.z+p.z));
								setStroke(unit.domain.colorTransparent);
								line(pPrev.x+centerX, pPrev.y+centerY, p.x+centerX, p.y+centerY);
							}
						}
						le.x = p.x+centerX;
						le.y = p.y+centerY;
						if(le.x<-10 || le.x>cW+10 || le.y<-10 || le.y>cH+10) continue;

						le.scale = p.z;

						onSelectedThread = threadSelected && pool.objectsInteraction.selectedObject.les.indexOf(le)!=-1;

						if(onSelectedThread){
							p.z*=1.6
						} else if(threadSelected){
							p.z*=0.5;
						}

						r = (leIsSelected && pool.objectsInteraction.selectedObject!=le)?2*p.z:2.5*p.z;


						fCircle(le.x, le.y, r);//, pool.viewParams.LES_INTERACTION_RADIUS*p.z);

						over = (Math.pow(mX-le.x, 2)+Math.pow(mY-le.y, 2)<(Math.pow(10*p.z, 2)+2)) && le.x<pool.viewParams.X_RULER+5;
						//if(over || selected){
						if(pool.objectsInteraction.overObject==le || selected){
							if(le.domains.length>1) drawDomainsFlowerSimple(le, context, le.x, le.y, 10*p.z);
						}
						
						if(over) overArray.push(le);//overElementOnDrawing = le;



						//if(over){
						if(pool.objectsInteraction.overObject==le){
							setLW(2*p.z);
							setStroke('rgba(0,0,0,0.7)');
							sCircleM(le.x, le.y, 5*p.z);
						}
						if(selected){
							setLW(1);

							setStroke(0,0,0, 0.4);
							sCircle(le.x, le.y, Math.min(0.2*(nF-pool.interaction.nFSelection), 20)*p.z);

						}
						pPrev = p;
					} else {
						pPrev = null;
					}
				}
				
				x+=wUnit;
			}
		}
	}

	if(overArray.length>0){
		if(overArray.length==1){
			overElementOnDrawing = overArray[0];
		} else {
			var dMin = 9999999;
			var d;
			overArray.forEach(function(le){
				d = Math.pow(mX-le.x, 2)+Math.pow(mY-le.y, 2);
				if(d<dMin){
					overElementOnDrawing = le;
					dMin = d;
				}
			});
		}
	}
}

drawLEsOnSpiralTouch = function(){
	var i, j, k, l;
	var course, unit, le;
	var t, r;
	var x, wUnit;
	var p, pPrev;
	var angle;
	var domains = pool.modelObjects.domains;
	var coursesMatrix = pool.tables.coursesMatrix;
	var selected, over;

	var centerX = pool.frames.centerX;
	var centerY = pool.frames.centerY;

	var highlighted = true;

	
	for(i=0; coursesMatrix[i]!=null; i++){
		for(j=0; j<coursesMatrix[i].length; j++){
			course = coursesMatrix[i][j];
			
			if(course==null) continue;
			
			angle = TwoPi*j/domains.length;
			
			x = 0;
			for(k=0; course.units[k]!=null; k++){
				unit = course.units[k];
				wUnit = unit.duration/unit.course.unitsDuration;
				pPrev = null;
				
				for(l=0; unit.les[l]; l++){
					le = unit.les[l];

					setFill(highlighted?le.color:'rgba(0,0,0,0.3)');

					p = le.p3D;
					p = pool.tD.e3D.projectCoordinates(p.x*pool.tD.scale, (p.y+pool.tD.yGrade)*pool.tD.scale, p.z*pool.tD.scale);
					p.z = p.z*pool.tD.scale*le.size*(highlighted?1:0.6);//rFromAngle(t)*0.006;
					le.visible = p.z>0.06;// && p.x+centerX>-5 && p.x+centerX<pool.viewParams.X_RULER+5 && p.y+centerY>-5 && p.y+centerY<cH+5;
					if(le.visible){
						
						le.x = p.x+centerX;
						le.y = p.y+centerY;
						if(le.x<-10 || le.x>cW+10 || le.y<-10 || le.y>cH+10) continue;

						le.scale = p.z;

						r = 2.5*p.z;

						fCircle(le.x, le.y, r, pool.viewParams.LES_INTERACTION_RADIUS) && le.x<pool.viewParams.X_RULER+5;

						pPrev = p;
					} else {
						pPrev = null;
					}
				}
				
				x+=wUnit;
			}
		}
	}
}

drawGrade = function(nGrade){
	var grades = pool.modelObjects.grades;
	var grade = grades[nGrade];

	if(grade==null) return;

	var p, prevP;

	var centerX = pool.frames.centerX;
	var centerY = pool.frames.centerY;

	var numVisible;
	var lastVisible;
	var lastTwoVisible;

	var j;
	var t, t0;
	var dA;
	var y;

	p = grade.p3D;
	p = pool.tD.e3D.projectCoordinates(p.x*pool.tD.scale, (p.y+pool.tD.yGrade)*pool.tD.scale, p.z*pool.tD.scale);
	p.z = p.z*pool.tD.scale*grade.size;
	p.x+=centerX;
	p.y+=centerY;

	numVisible = p.z>0.25 && p.x>-10 && p.x<cW+10 && p.y>-10 && p.y<cH+10;

	if(numVisible){
		setText('rgba(0,0,0,0.5)', 44*p.z, null, 'center', 'middle');
		fText(nGrade==0?"K":nGrade, p.x, p.y);
	}

	//gradeLimitMarks(nGrade); //not working anyways

	dA = TwoPi/50;

	t0 = t = (nGrade)*TwoPi;
	prevP = spiralFunctionSimple(t);
	prevP.x*=1.3;
	prevP.z*=1.3;
	prevP = pool.tD.e3D.projectCoordinates(prevP.x*pool.tD.scale, (prevP.y+pool.tD.yGrade)*pool.tD.scale, prevP.z*pool.tD.scale);
	prevP.z *= pool.tD.scale*rFromAngle(t)*0.004;
	prevP.x+=centerX;
	prevP.y+=centerY;

	//setStroke(0,0,0,0.05);
	setStroke('rgba(0,0,0,0.8)');

	for(j=1; j<=50; j++){
		if(numVisible && j>23 && j<27) continue;
		t = t0 + j*dA;
		p = spiralFunctionSimple(t);
		p.x*=1.3;
		p.z*=1.3;
		p = pool.tD.e3D.projectCoordinates(p.x*pool.tD.scale, (p.y+pool.tD.yGrade)*pool.tD.scale, p.z*pool.tD.scale);
		if(p.z<0 || prevP.z<0) continue;

		p.z *= pool.tD.scale*rFromAngle(t)*0.004;
		p.x+=centerX;
		p.y+=centerY;

		if(!numVisible || j!=27){
			context.lineWidth = p.z*1.5+0.5;

			context.beginPath();
			context.moveTo(prevP.x, prevP.y);
			context.lineTo(p.x, p.y);
			context.stroke();
		}

		prevP = p;
	}
}

gradeLimitMarks = function(nGrade){
	gradeLimitMark(nGrade);
	gradeLimitMark(nGrade+1);
}

gradeLimitMark = function(nGrade){
	grade = grades[nGrade];
	if(grade==null) return;

	var centerX = pool.frames.centerX;
	var centerY = pool.frames.centerY;

	var prevP = grade.p3D1;
	prevP = pool.tD.e3D.projectCoordinates(prevP.x*pool.tD.scale, (prevP.y+pool.tD.yGrade)*pool.tD.scale, prevP.z*pool.tD.scale);
	prevP.x+=centerX;
	prevP.y+=centerY;
	prevP.z = prevP.z*pool.tD.scale*grade.p3D1.size;

	var p = grade.p3D1B;
	p = pool.tD.e3D.projectCoordinates(p.x*pool.tD.scale, (p.y+pool.tD.yGrade)*pool.tD.scale, p.z*pool.tD.scale);
	p.x+=centerX;
	p.y+=centerY;

	setStroke('rgba(0,0,0,'+3*prevP.z+')', 1);
	line(prevP.x, prevP.y, p.x, p.y);
}


var DASH_ARRAY = [3, 2]; //move this please
var DASH_SPEED = -0.3;


drawThreads = function(overLE){
	var i, j;
	var threads = pool.modelObjects.threads;
	var thread;
	var poly;

	var someSelected = pool.objectsInteraction.selectedObject!=null && pool.objectsInteraction.selectedObject.threads!=null;
	//var overLE = pool.objectsInteraction.overObject!=null && pool.objectsInteraction.overObject.type=='le';

	if(userAgent=="CHROME"){
		context.setLineDash(DASH_ARRAY);
	} else {
		setStroke('rgba(0,0,0,0.7)');
	}
	
	for(i=0; threads[i]!=null; i++){
		drawThread(threads[i], pool.objectsInteraction.overObject==threads[i], overLE);//pool.objectsInteraction.selectedObject==threads[i] || (someSelected && pool.objectsInteraction.selectedObject.threads.indexOf(threads[i])!=-1));
	}

	if(userAgent=="CHROME") context.setLineDash([]);
	
}

drawThread = function(thread, overThread, overLE){
	if(thread.les.length<3) return;

	isSelected = thread==pool.objectsInteraction.selectedObject;

	var factor = 0.3;

	var i;
	var x, y, x1, y1, x2, y2, cx, cy, cx1, cy1;
	var a, prevA;
	var s;
	var p;

	var lwBase = isSelected?1:0.5;
	var color = 'rgb(50,50,50)';// ColorOperators.interpolateColors(thread.color, 'black', 0.1);

	var over, overI;

	var le;
	var notOverOtherObject;

	setStroke(color);
	setFill(color);

	for(i=0; thread.les[i+2]!=null; i++){
		le = thread.les[i];

		if(!le.visible || le.x==null || !thread.les[i+1].visible || thread.les[i+1].x==null) continue;// || !thread.les[i+2].visible || thread.les[i+2].x==null) continue;

		x = le.x;
		y = le.y;
		x1 = thread.les[i+1].x;
		y1 = thread.les[i+1].y;
		if(thread.les[i+2].visible && thread.les[i+2].x!=null){
			x2 = thread.les[i+2].x;
			y2 = thread.les[i+2].y;
		} else {
			x2 = x1;
			y2 = y1;
		}

		a = Math.atan2(y2-y, x2-x);
		s = Math.sqrt(Math.pow(y1-y, 2) + Math.pow(x1-x, 2))*factor;

		if(prevA==null){
			cx = x;
			cy = y;
		} else {
			cx = x + s*Math.cos(prevA);
			cy = y + s*Math.sin(prevA);
		}

		cx1 = x1 - s*Math.cos(a);
		cy1 = y1 - s*Math.sin(a);

		if(isSelected) context.lineDashOffset = nF*DASH_SPEED;

-		setLW(lwBase*Math.min((le.scale+thread.les[i+1].scale), 4)*0.5);

		over = bezierM(x, y, cx, cy, cx1, cy1, x1, y1, 10) && !overLE; //&& (le==pool.objectsInteraction.selectedObject || thread.les[i+1]==pool.objectsInteraction.selectedObject);

		if(over) overElementOnDrawing = thread;

		if(isSelected || overThread){
			setLW(lwBase*Math.min((le.scale+thread.les[i+1].scale)*1.5, isSelected?4:10));
			bezier(x, y, cx, cy, cx1, cy1, x1, y1, 5);
			overI = i;
		}

		if(isSelected) context.lineDashOffset = 0;

		prevA = a;
	}

	if(le.visible && le.x!=null && thread.les[i+1].visible && thread.les[i+1].x!=null){
		x = x1;
		y = y1;
		cx = x1 + s*Math.cos(prevA);
		cy = y1 + s*Math.sin(prevA);

		setLW(lwBase*Math.min((le.scale+thread.les[i+1].scale), 4)*0.5);

		if(pool.isTouch){
			bezier(x, y, cx, cy, x2, y2, x2, y2, 10)// && (le==pool.objectsInteraction.selectedObject || thread.les[i+1]==pool.objectsInteraction.selectedObject);
		} else {
			over = bezierM(x, y, cx, cy, x2, y2, x2, y2, 10)  && !overLE; //&& (le==pool.objectsInteraction.selectedObject || thread.les[i+1]==pool.objectsInteraction.selectedObject);
		}
		
		if(over) overElementOnDrawing = thread;

		if(isSelected || overThread){
			setLW(lwBase*Math.min((le.scale+thread.les[i+1].scale)*1.5, isSelected?4:10));
			bezier(x, y, cx, cy, x2, y2, x2, y2, 5);
			overI = i;
		}
		
	}

	notOverOtherObject = pool.objectsInteraction.overObject==null ||  pool.objectsInteraction.overObject.type != 'le';
}




drawIntegrations = function(){
	if(
		pool.objectsInteraction.selectedObject!=null && 
		(pool.objectsInteraction.selectedObject.type=='domain' || pool.objectsInteraction.selectedObject.type=='thread')
	) return;

	var i, j;
	var p;
	var integrations = pool.modelObjects.integrations;
	var integration;
	var selected;
	var le;
	var r, a;
	var grey;

	var centerX = pool.frames.centerX;
	var centerY = pool.frames.centerY;

	var leIsSelected = pool.objectsInteraction.selectedObject!=null && pool.objectsInteraction.selectedObject.type=='le';//move this to global (pool.objectsInteraction)
	var integrationIsSelected = pool.objectsInteraction.selectedObject!=null && pool.objectsInteraction.selectedObject.type=='integration';

	for(i=0; integrations[i]!=null; i++){
		integration = integrations[i];

		if(integrationIsSelected && pool.objectsInteraction.selectedObject!=integration) continue;
		if(leIsSelected && integration.les.indexOf(pool.objectsInteraction.selectedObject)==-1) continue;

		if(integration.les.length==0) continue;

		if(integration.p3D == null){
			continue;
		}
		p = pool.tD.e3D.projectCoordinates(integration.p3D.x*pool.tD.scale, (integration.p3D.y+pool.tD.yGrade)*pool.tD.scale, integration.p3D.z*pool.tD.scale);

		p.z *= pool.tD.scale*integration.size;

		if(p.z<0.1) continue;
		
		integration.x = p.x + centerX;
		integration.y = p.y + centerY;

		if(integration.x<-20 || integration.x>cW+20 || integration.y<-20 || integration.y>cH+20) continue;

		selected = pool.objectsInteraction.selectedObject==integration;

		if(selected){
			setLW(1);
			setStroke(0,0,0, 0.4);
			sCircle(integration.x, integration.y, Math.min(0.2*(nF-pool.interaction.nFSelection)+11, 40)*p.z);

			//if(!pool.frames.mouseInCanvas) drawLineToPanel(integration.x+15*p.z, integration.y);
		}

		drawDomainsFlowerSimple(integration, context, integration.x, integration.y, p.z*11);
		

		r = 12*p.z;
		setStroke('black');
		setLW(0.4*p.z);
		if(sCircleM(integration.x, integration.y, r, r*0.2 + 2) && integration.x<pool.viewParams.X_RULER+5){
			//pool.objectsInteraction.overObject = integration;
			
			setCursor('pointer');
			overElementOnDrawing = integration;
		}

		for(j=0; integration.les[j]!=null; j++){
			le = integration.les[j];
			if(!le.visible) continue;
			a = Math.atan2(integration.les[j].y - integration.y, integration.les[j].x - integration.x);
			setLW((le.scale + p.z)*(selected?0.3:0.1));
			line(integration.x + r*Math.cos(a), integration.y + r*Math.sin(a), integration.les[j].x, integration.les[j].y);
		}
		
	}
}

