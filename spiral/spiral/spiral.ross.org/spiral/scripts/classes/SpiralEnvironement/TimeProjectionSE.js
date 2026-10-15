spiralMovement = function(){
	pool.frames.frame.width = pool.viewParams.X_RULER;
	pool.frames.centerX = pool.frames.frame.width*0.5;

	pool.tD.yGrade = -yFromR(rFromAngle(pool.tD.iGrade*TwoPi));

	var friction = pool.isTouch?0.9:0.99;

	var stopped = false;

	if(pool.tD.following){
		if(pool.isTouch){
			pool.tD.va = 0.9*pool.tD.va + 0.1*0.9;// pool.spiral.V_FOLLOW_ANGULAR;
		} else {
			pool.tD.va = 0.97*pool.tD.va + 0.03*0.95;// pool.spiral.V_FOLLOW_ANGULAR;
		}
		var av = 1 - pool.tD.va;
		
		pool.tD.angle = pool.tD.va*pool.tD.angle + av*pool.tD.angleDestiny;

		pool.tD.alfa = pool.tD.va*pool.tD.alfa + (pool.tD.leaned?(av*(-0.25*Math.PI)):0);
		pool.tD.gama = pool.tD.va*pool.tD.gama + av*Math.PI;

		pool.tD.e3D.setAngles(new Point3D(pool.tD.alfa, pool.tD.angle, pool.tD.gama));
		
		var iGradeDestiny = -(pool.tD.angle + 0.5*Math.PI)/TwoPi;
		
		pool.tD.scaleDestiny = pool.tD.zoomFactor/(rFromAngle(-pool.tD.angle)*pool.tD.wideView);
		
		pool.tD.iGrade = pool.tD.va*pool.tD.iGrade + av*iGradeDestiny;
		pool.tD.iGrade = pool.tD.va*pool.tD.iGrade + av*iGradeDestiny;

		pool.tD.scale = pool.tD.va*pool.tD.scale + av*pool.tD.scaleDestiny;


		stopped = Math.abs(pool.tD.angle - pool.tD.angleDestiny) + Math.abs(pool.tD.iGrade - iGradeDestiny) + Math.abs(pool.tD.scale - pool.tD.scaleDestiny)<0.001;

	} else {
		pool.tD.scale = 0.9*pool.tD.scale + 0.1*pool.tD.scaleDestiny;

		pool.tD.e3D.applyRotation(pool.tD.rotationVector);
		pool.tD.rotationVector.x*=friction;
		pool.tD.rotationVector.y*=friction;

		stopped = pool.tD.rotationVector.getNorm()<0.01;
	}

	if(pool.isTouch){
		if(pool.spiralMoving && stopped && !MOUSE_PRESSED){
			drawTouchComplete();
			pool.spiralMoving = false;
			unOverObject();
			pool.tD.following = false;
		} 
	}
}

prepareAnglesToStartFollowing = function(){

	var eu = pool.tD.e3D.getEulerAngles();

	var angleDestinySimple = pool.tD.angleDestiny;

	angleDestinySimple = _closeAngle(angleDestinySimple, 0);

	var eu1 = new Point3D(eu.x+Math.PI, Math.PI-eu.y, eu.z+Math.PI);
	var eu2 = new Point3D(eu.x-Math.PI, Math.PI-eu.y, eu.z-Math.PI);

	eu.x = _closeAngle(eu.x, 0);
	eu.y = _closeAngle(eu.y, angleDestinySimple);
	eu.z = _closeAngle(eu.z, Math.PI);

	eu1.x = _closeAngle(eu1.x, 0);
	eu1.y = _closeAngle(eu1.y, angleDestinySimple);
	eu1.z = _closeAngle(eu1.z, Math.PI);

	eu2.x = _closeAngle(eu2.x, 0);
	eu2.y = _closeAngle(eu2.y, angleDestinySimple);
	eu2.z = _closeAngle(eu2.z, Math.PI);


	var dA0 = _distanceA(eu,  0, angleDestinySimple, Math.PI);
	var dA1 = _distanceA(eu1, 0, angleDestinySimple, Math.PI);
	var dA2 = _distanceA(eu2, 0, angleDestinySimple, Math.PI);


	if(dA0<dA1 && dA0<dA2){
		pool.tD.alfa = eu.x;
		pool.tD.angle = eu.y;
		pool.tD.gama = eu.z;
	} else if(dA1<dA0 && dA1<dA2){
		pool.tD.alfa = eu1.x;
		pool.tD.angle = eu1.y;
		pool.tD.gama = eu1.z;
	} else {
		pool.tD.alfa = eu2.x;
		pool.tD.angle = eu2.y;
		pool.tD.gama = eu2.z;
	}

	pool.tD.angle = _closeAngle(pool.tD.angle, pool.tD.angleDestiny);
}


followAngle = function(a, leaned){
	//pool.tD.zoomFactor = zoomFactor==null?pool.viewParams.ZOOM_ON_SELECTION_FACTOR:zoomFactor;
	//c.l('()()()()()>>> pool.tD.zoomFactor:', pool.tD.zoomFactor);
	if(pool.isTouch) pool.spiralMoving = true;
	pool.tD.following = true;
	pool.tD.angleDestiny = a;//-TwoPi*(cH- 2 - mY)/dY - 0.5*Math.PI;
	prepareAnglesToStartFollowing();
	pool.tD.leaned = leaned;
	console.log("\n\n[follow angle], pool.tD.angleDestiny:", pool.tD.angleDestiny);
}

zoomStep = function(positive){
	pool.tD.scaleDestiny = Math.min(Math.max(pool.tD.scale*(1+0.3*(positive?1:-1)), 0.0002), 2);

	if(pool.isTouch){
		pool.tD.scale = pool.tD.scaleDestiny;
	} else {
		pool.tD.following = false;
		reStartCycle();
	}
}

_closeAngle = function(angle, reference){
	while(angle-reference>Math.PI) angle-=TwoPi;
	while(reference - angle>Math.PI) angle+=TwoPi;
	return angle;
}

_distanceA = function(angles, a, b, c){
	return 0.5*Math.abs(angles.x-a)+Math.abs(angles.y-b)+0.5*Math.abs(angles.z-c);
}






////


projectionX = function(year){
	return gradesTime(year);
}

projectionXInverse = function(x){
	return gradesTimeInverse(x);
}




gradesTime = function(year){
	var grades = pool.modelObjects.grades;
	var i;
	var dX = pool.frames.tlProjectionFrame.width/grades.length;

	for(i=0; grades[i]!=null; i++){
		if(year>=grades[i].date_start && year<grades[i].date_finish){
			
			//exception for first mentality, to appear a little bit earlier than -10000
			if(i==3) return pool.frames.tlProjectionFrame.x + i*dX + dX*Math.pow((year-grades[i].date_start)/grades[i].years_duration, 300);
			
			return pool.frames.tlProjectionFrame.x + i*dX + dX*(year-grades[i].date_start)/grades[i].years_duration;
		}
	}

	return pool.frames.tlProjectionFrame.x + (i-1)*dX + dX*(year-grades[i-1].date_start)/grades[i-1].years_duration;
}

gradesTimeInverse = function(x){
	var grades = pool.modelObjects.grades;
	var i;
	var dX = pool.frames.tlProjectionFrame.width/grades.length;
	var nG = grades.length*(x-pool.frames.tlProjectionFrame.x)/pool.frames.tlProjectionFrame.width;
	var iG = Math.floor(nG);
	var t = nG-iG;
	
	return grades[iG].date_start + t*grades[iG].years_duration;
}

init3D = function(){
	pool.tD.e3D = new Engine3D({
		lens:300
	});
	pool.tD.e3D.setAngles(new Point3D(0,0.1, Math.PI));
	
	if(!ADD_CHROME_ERROR_HACK || pool.isTouch){ //[!!] RECENT CHROME CHANGES FIX
		pool.tD.dragging = new DragDetection({
			listenerFunction:draggingListener,
			areaVerificationFunction:areaRotation
		});
		pool.tD.dragging.factor = 0.01;
	}
	
	addInteractionEventListener('mousewheel', wheel3D, this);
	
	pool.tD.rotationVector = new Point(0,0);
}

placeObjectsOnSpiral = function(){
	var CUT_SUBDOMAINS_DOMAINS = 3;

	var i, j, k, l;
	var course, unit, le;
	var t;
	var x, wUnit;
	var angle;
	var domains = pool.modelObjects.domains;
	var integrations = pool.modelObjects.integrations;
	var courses = pool.modelObjects.courses;
	var grades = pool.modelObjects.grades;
	var coursesMatrix = pool.tables.coursesMatrix;
	
	for(i=0; coursesMatrix[i]!=null; i++){
		for(j=0; j<coursesMatrix[i].length; j++){
			course = coursesMatrix[i][j];
			
			if(course==null) continue;

			angle = TwoPi*i + Math.PI;

			course.angle = angle;
			
			x = 0;

			for(k=0; course.units[k]!=null; k++){
				unit = course.units[k];
				wUnit = unit.duration/unit.course.unitsDuration;
				unit.angle = 0;
				
				for(l=0; unit.les[l]; l++){
					le = unit.les[l];
					le.angle = t = (i + x + wUnit*l/unit.les.length)*TwoPi;
					//pool.spiral.RADIAL_FACTOR = le.domain.id=='CH'?0:0.05;

					le.p3D = spiralFunction(t, Math.min(j, domains.length - CUT_SUBDOMAINS_DOMAINS-1)*TwoPi/(domains.length-CUT_SUBDOMAINS_DOMAINS));
					le.size = rFromAngle(t)*0.006;
					unit.angle+=le.angle;

					coordinatesObject.les.push(
						{
							x:le.p3D.x,
							y:le.p3D.y,
							z:le.p3D.z,
							s:le.size
						}
					);

				}
				if(unit.les.length==0){
					unit.angle = (i + x + wUnit*0.5)*TwoPi;
				} else {
					unit.angle/=unit.les.length;
				}
				
				x+=wUnit;
			}
		}
	}

	for(i=0; integrations[i]!=null; i++){
		integration = integrations[i];
		integration.angle = 0;
		//c.l('\nintegration.grade.id', integration.grade.id);
		//c.l('integration.grade', integration.grade);
		//c.l(integration.title);
		//c.l('integration.les.length', integration.les.length);
		for(j=0; integration.les[j]; j++){
			le = integration.les[j];
			integration.angle += le.angle;
			//c.l('  j, le.angle, le.grade.id', j, le.angle, le.grade.id);
			//c.l('  (le.angle + HalfPi)/TwoPi', Math.round( (le.angle + HalfPi)/TwoPi ) ) ;
		}
		integration.angle/=integration.les.length;
		//c.l('integration.angle', integration.angle);
	}

	for(i=0; courses[i]!=null; i++){
		course = courses[i];
		if(course.units.length>0){
			course.angle = 0;
			for(j=0; course.units[j]; j++){
				le = course.units[j];
				course.angle += le.angle;
			}
			course.angle/=course.units.length;
		}
	}

	for(i=0; grades[i]!=null; i++){
		grades[i].iGrade = Number(grades[i].id.substr(1));
		grades[i].angle = (i+0.5)*TwoPi;

		grades[i].p3D = spiralFunctionSimple(grades[i].angle);
		grades[i].p3D.x*=1.3;
		grades[i].p3D.z*=1.3;
		grades[i].size = rFromAngle(grades[i].angle)*0.006;

		grades[i].p3D1 = spiralFunctionSimple((i+1)*TwoPi);
		grades[i].p3D1.x*=1.25;
		grades[i].p3D1.z*=1.25;
		grades[i].p3D1.size = rFromAngle((i+1)*TwoPi)*0.006;

		grades[i].p3D1B = spiralFunctionSimple((i+1)*TwoPi);
		grades[i].p3D1B.x*=1.33;
		grades[i].p3D1B.z*=1.33;

		grades[i].neutral = true;
	}

	var midDate;

	for(i=0; pool.modelObjects.mentalities[i]!=null; i++){
		midDate = gradesTime(pool.modelObjects.mentalities[i].date_start);
		pool.modelObjects.mentalities[i].angle = 2*TwoPi+TwoPi*12*(midDate-pool.frames.tlProjectionFrame.x)/pool.frames.tlProjectionFrame.width;
		pool.modelObjects.mentalities[i].neutral = true;
		pool.modelObjects.mentalities[i].wideView = 3;
	}
	for(i=0; pool.modelObjects.ecologies[i]!=null; i++){
		midDate = (gradesTime(pool.modelObjects.ecologies[i].date_start)+gradesTime(pool.modelObjects.ecologies[i].date_finish))*0.55; //WHY?????
		pool.modelObjects.ecologies[i].angle = TwoPi*12*(midDate-pool.frames.tlProjectionFrame.x)/pool.frames.tlProjectionFrame.width;
		pool.modelObjects.ecologies[i].neutral = true;
		pool.modelObjects.ecologies[i].wideView = 1 + 0.3*12*(gradesTime(pool.modelObjects.ecologies[i].date_finish) - gradesTime(pool.modelObjects.ecologies[i].date_start))/pool.frames.tlProjectionFrame.width;
		c.l(i, pool.modelObjects.ecologies[i].date_start, pool.modelObjects.ecologies[i].title );
	}
}

placeIntegrationsOnSpiral = function(){
	var i, j;
	var integrations = pool.modelObjects.integrations;
	var integration, integration1;
	var le;
	var t;
	var p0;
	var d;
	var prop;
	var v;

	for(i=0; integrations[i]!=null; i++){
		integration = integrations[i];
		if(integration.les.length==0) continue;
		integration.p3D = new Point3D(0,0,0);
		t = 0;
		for(j=0; integration.les[j]!=null; j++){
			le = integration.les[j];

			integration.p3D.x += le.p3D.x/integration.les.length;
			integration.p3D.y += le.p3D.y/integration.les.length;
			integration.p3D.z += le.p3D.z/integration.les.length;
			t += le.angle;
		}

		integration.p3D.x*=1 - 0.5/integration.les.length;
		integration.p3D.z*=1 - 0.5/integration.les.length;

		integration.size = rFromAngle(t/integration.les.length)*0.006;

		coordinatesObject.ips.push(
			{
				x:integration.p3D.x,
				y:integration.p3D.y,
				z:integration.p3D.z,
				s:integration.size
			}
		);
	}

	for(t=0; t<10; t++){

		for(i=0; integrations[i+1]!=null; i++){
			integration = integrations[i];
			p0 = integration.p3D;
			if(p0==null) continue;
			for(j=i+1; integrations[j]!=null; j++){
				integration1 = integrations[j];
				if(integration1.p3D == null) continue;
				d = integration1.p3D.distanceToPoint3D(p0);
				prop = 0.075*d/(integration.size+integration1.size);
				if(prop<1.2){
					v = integration1.p3D.subtract(p0).factor(1.3-prop);
					integration1.p3D = integration1.p3D.add(v);
					integration.p3D = integration.p3D.subtract(v);
				}
			}
		}

	}
}



buildSpirals = function(){
	var i, j;
	var N_PERIODS = pool.modelObjects.grades.length;
	var N_STEPS = pool.spiral.N_PERIODS*pool.spiral.N_STEPS_PER_PERIOD;
	var dA = TwoPi/pool.spiral.N_STEPS_PER_PERIOD;
	var N_THREADS =  pool.modelObjects.domains.length;
	var t;
	
	pool.tD.polygon3DList = new Table();
	
	for(i=0; i<N_STEPS; i++){
		t = i*dA;
		for(j=0; j<8; j++){
			if(i==0) pool.tD.polygon3DList[j] = new Polygon();
			pool.tD.polygon3DList[j][i] = spiralFunction(t, j*TwoPi/N_THREADS);
		}
	}
}



spiralFunction = function(a, offset){
	var r = 0.3*Math.pow(2, pool.spiral.CYCLES_OFFSET + a/TwoPi);//rFromAngle(a);
	var r2 = r*pool.spiral.RADIAL_FACTOR;
	var a2 = a*pool.spiral.ANGULAR_TORSION + offset;
	
	var R = r+r2*Math.cos(a2);
	
	return new Point3D(R*Math.cos(a), yFromR(r) - r2*Math.sin(a2), R*Math.sin(a));
}

spiralFunctionSimple = function(a){
	var R = rFromAngle(a);
	return new Point3D(R*Math.cos(a), yFromR(R), R*Math.sin(a));
}

yFromR = function(r){
	return pool.spiral.VERTICAL_FACTOR*0.015*(r+50*Math.sqrt(r));
}

rFromAngle = function(a){
	return 0.3*Math.pow(2, pool.spiral.CYCLES_OFFSET + a/TwoPi);
}


scaleFromGrade = function(grade){
	return 200/(rFromAngle( grade*TwoPi-HalfPi )*pool.tD.wideView);
}

draggingListener=function(draggingVector){
	pool.tD.rotationVector = draggingVector;
}

areaRotation = function(){
	return true;
}


//////////////
///
///

domainCoordinates = function(){//only for printing coordinates purpose --> export to 3D file
	var CUT_SUBDOMAINS_DOMAINS = 3;
	var domain;
	var offset;
	var domains = pool.modelObjects.domains;
	var N_PERIODS = pool.modelObjects.grades.length;
	var N_STEPS = N_PERIODS*pool.spiral.N_STEPS_PER_PERIOD;
	var offsetFactor = TwoPi/(domains.length-CUT_SUBDOMAINS_DOMAINS);
	var dA = TwoPi/pool.spiral.N_STEPS_PER_PERIOD;
	var i, j;


	for(i=0; domains[i+CUT_SUBDOMAINS_DOMAINS]!=null; i++){
		domain = domains[i];
		offset = i*offsetFactor;
		domainPoints = [];

		coordinatesObject.domains.push(domainPoints)

		for(j=0; j<N_STEPS; j++){
			t = j*dA;
			p = spiralFunction(t, offset);
			p = {
				x:p.x,
				y:p.y, 
				z:p.z
			};
			domainPoints.push(p);
		}
	}

}

