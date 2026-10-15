//var prvmX = 0;
//var prvmY = 0;
//var _LAST_TIME = 0;

initInteraction = function(){
	NF_DOWN = -1;
	NF_FASTUP = -1;
	
	//
	
	enterFrame = function(){
		MOUSE_DOWN = NF_DOWN==nF;
		MOUSE_UP = NF_UP==nF;
		MOUSE_UP_FAST = MOUSE_UP && (nF-NF_DOWN)<9;

		if(ADD_CHROME_ERROR_HACK && !pool.isTouch && MOUSE_PRESSED) draggingListener(new Point( (mX - prvmX)*0.01, (mY - prvmY)*0.01 ) ); //[!!] RECENT CHROME CHANGES FIX

		cycle();

		if(ADD_CHROME_ERROR_HACK && !pool.isTouch){ //[!!] RECENT CHROME CHANGES FIX
			prvmX = mX;
			prvmY = mY;
		}

		nF++;

		if(ADD_CHROME_ERROR_HACK && !pool.isTouch) _LAST_TIME = new Date().getTime(); //[!!] RECENT CHROME CHANGES FIX
	};

	if(pool.isTouch){
		canvas.addEventListener("touchstart", onTouchInteraction, false);
		canvas.addEventListener("touchend", onTouchInteraction, false);
		canvas.addEventListener("touchmove", onTouchInteraction, false);
		canvas.addEventListener("gesturestart", onTouchInteraction, false);
		canvas.addEventListener("gestureend", onTouchInteraction, false);
		canvas.addEventListener("gesturechange", onTouchInteraction, false);

		pool.spiralMoving = true;
		followAngle(-12.5*TwoPi, true);

		pool.viewParams.LES_INTERACTION_RADIUS = pool.viewParams.LES_INTERACTION_RADIUS_TOUCH;

		pool.viewParams.RULER_STATE = 1;
		
	} else {
		addInteractionEventListener('mousedown', onMouse, this);
		addInteractionEventListener('mouseup', onMouse, this);
		addInteractionEventListener("keydown", onKeyDown, this);
		//mousewheel listener added at init3D, at TimeProjectionSE
		
		pool.viewParams.LES_INTERACTION_RADIUS = pool.viewParams.LES_INTERACTION_RADIUS_COMP;
	}
}

onTouchInteraction = function(e){
	//if(!pool.frames.mouseInCanvas || pool.interaction.oveInterfaceButton) return;

	switch(e.type){
		case 'touchstart':
			c.l('\n\n\n\n[Touch] -----> touchstart');
			
			// _tDown = new Date().getTime();
			// c.l('    [Touch], _tDown:', _tDown);

			mX = e.pageX;
			mY = e.pageY;
			mP.x = mX;
			mP.y = mY;

			MOUSE_DOWN = true;
			MOUSE_PRESSED = true;

			c.log('    [Touch] => call unOverObject');
			unOverObject();

			if(mX>pool.viewParams.X_RULER) pool.spiralMoving = true;

			onMouse({type:'mousedown'});
			

			c.l('dragging, pool.spiralMoving:', pool.spiralMoving);
			pool.tD.dragging.onMouse({type:'mousedown'});

			break;
		case 'touchend':
			c.log('\n\n[Touch] -----> touchend');

			MOUSE_UP = true;
			MOUSE_DOWN = false;
			MOUSE_PRESSED = false;

			var fast = (new Date().getTime()-_tDown)<(pool.isTouch?600:300);

			//c.l('  [Touch] fast, _tDown, new Date().getTime(), new Date().getTime()-_tDown', fast, _tDown, new Date().getTime(), new Date().getTime()-_tDown);

			if(fast){// && mX<pool.viewParams.X_RULER){
				c.l('    [Touch] ====> fast touch detected!');
				
				_tDown = new Date().getTime();

				var prevSelected = pool.objectsInteraction.selectedObject;
				var selectedObject = null;
				c.l('    [Touch] prevSelected', prevSelected);
				c.l('    [Touch] ==> calls drawTouchComplete, pool.objectsInteraction.selectedObject==null, pool.objectsInteraction.overObject==null', pool.objectsInteraction.selectedObject==null, pool.objectsInteraction.overObject==null);
				drawTouchComplete();

				c.l('    [Touch] pool.objectsInteraction.selectedObject', pool.objectsInteraction.selectedObject);
				c.l('    [Touch] pool.objectsInteraction.overObject', pool.objectsInteraction.overObject);

				if(pool.objectsInteraction.overObject==null){
					if(prevSelected!=null){
						c.l('    [Touch] => call unSelectObject');
						unOverObject();
						unSelectObject();
						pool.tD.dragging.onMouse({type:'mouseup'});
						c.l('    [Touch] ==> calls drawTouchComplete, pool.objectsInteraction.selectedObject==null, pool.objectsInteraction.overObject==null', pool.objectsInteraction.selectedObject==null, pool.objectsInteraction.overObject==null);
						//drawTouchComplete();
					}
				} else {
					if(prevSelected!=pool.objectsInteraction.overObject){
						c.l('    [Touch] => call selectObject of pool.objectsInteraction.overObject.id:', pool.objectsInteraction.overObject.id);
						selectObject(pool.objectsInteraction.overObject);
						c.l('    [Touch] ==> calls drawTouchComplete, pool.objectsInteraction.selectedObject==null, pool.objectsInteraction.overObject==null', pool.objectsInteraction.selectedObject==null, pool.objectsInteraction.overObject==null);
						//drawTouchComplete();
					}
				} 
				
				//pool.spiralMoving =  false;
				pool.spiralMoving = mX>=pool.viewParams.X_RULER; //only touching the ruler makes the spiral move

				c.l('    [Touch] ==> calls drawTouchComplete');
				drawTouchComplete();

			}

			pool.tD.dragging.onMouse({type:'mouseup'});

			c.l('    [Touch] ====> pool.objectsInteraction.selectedObject==null', pool.objectsInteraction.selectedObject==null);
			c.l('    [Touch] ====> pool.objectsInteraction.overObject==null', pool.objectsInteraction.overObject==null);
			
			break;
		case 'touchmove':
			mX = e.pageX;
			mY = e.pageY;
			mP.x = mX;
			mP.y = mY;

			MOUSE_UP = false;
			MOUSE_DOWN = false;
			MOUSE_PRESSED = true;

			pool.spiralMoving = true;

			//clearContext();
			//drawTouch();

			break;
		case 'gesturestart':
			pool.tD.scaleDestinyOnPinch = pool.tD.scaleDestiny;
			break;
		case 'gestureend':
			break;
		case 'gesturechange':
			wheel3D({value:e.scale-1});
			break;
	}

	//setFill('rgba(255,0,0,0.2)');
	//fCircle(mX, mY, 50);
}

onMouse = function(e){
	if(!pool.frames.mouseInCanvas || pool.interaction.oveInterfaceButton){
		if(pool.isTouch) _tDown = new Date().getTime();
		return;
	}

	
	switch(e.type){
		case 'mousedown':
			NF_DOWN = nF;

			pool.tD.following = false;
			_tDown = new Date().getTime();

			//if(pool.objectsInteraction.overObject==null) pool.tD.following = false;
			pool.interaction.mousePressed = true;
			pool.tD.va = 1;
			break;
		case 'mouseup':
			c.log('mouseup');

			NF_UP = nF;

			var fast = (new Date().getTime()-_tDown)<(pool.isTouch?600:300);

			if(fast){
				c.log('====> fast indeed, pool.objectsInteraction.overObject:', pool.objectsInteraction.overObject);
				NF_FASTUP = nF;

				if(pool.objectsInteraction.overObject==null){
					var W_TL = pool.viewParams.V_RULER;
					var x0 = pool.viewParams.X_RULER;
					var mouseOnTimeline = pool.frames.mouseInRuler = mX>x0 && mX<x0+W_TL;
					if( !mouseOnTimeline ) unSelectObject();
				} else {
					console.log('no-touch selectObject')
					selectObject(pool.objectsInteraction.overObject);
				}

			}
			if(pool.objectsInteraction.overObject==null){
				pool.tD.dragged = true;
			}

			pool.interaction.mousePressed = false;

			break;
	}

	reStartCycle();
}

wheel3D = function(e){
	//return;

	if(!pool.frames.mouseInCanvas) return;

	var n = pool.tD.e3D.projectCoordinates(0, 1, 0);
	n = Math.pow(1 - Math.sqrt(Math.pow(n.x, 2)+Math.pow(n.y,2)), 2);
	if(n>0.7) n=1;

	//n=1;

	//c.l(n);

	pool.tD.iGrade = Math.max(Math.min(pool.tD.iGrade*(1-n*0.01*e.value), 13), 0);

	pool.tD.following = false;
	if(pool.isTouch){
		pool.tD.scaleDestiny =  pool.tD.scaleDestinyOnPinch*(1+e.value);// Math.min(Math.max(pool.tD.scaleDestiny*(1+0.1*e.value), 0.0002), 2);
	} else {
		//pool.tD.scaleDestiny = Math.min(Math.max(pool.tD.scaleDestiny*(1+0.1*e.value), 0.0002), 2);
		
		var central = scaleFromGrade(pool.tD.iGrade);
		var limSup = central*5;
		var linInf = central*0.2;

		pool.tD.scaleDestiny = Math.min(Math.max(pool.tD.scaleDestiny*(1+0.2*(1-n)*e.value), linInf), limSup);
	}
	
	//
	if(pool.isTouch) pool.tD.scale = pool.tD.scaleDestiny;

	reStartCycle();
}
//var iGradeDestiny = -(pool.tD.angle + 0.5*Math.PI)/TwoPi; angle = -grade*TwoPi-HalfPi
//pool.tD.scaleDestiny = 200/(rFromAngle(-pool.tD.angle)*pool.tD.wideView);

onKeyDown=function(e){
	if(e.keyCode==38 || e.keyCode==40){
		zoomStep(e.keyCode==38);
	}

	if(e.keyCode==37 || e.keyCode==39){
		
		pool.tD.following = true;
		pool.tD.angleDestiny += (e.keyCode==37?1:-1)*Math.PI/6;
		prepareAnglesToStartFollowing();

		reStartCycle();
	}
}