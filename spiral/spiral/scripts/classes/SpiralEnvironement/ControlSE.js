selectObjectSE = function(object){

	c.log( "selectObjectSE: ", object);// object.type + ", " + object.id);

	if(object.angle!=null && !pool.isTouch){
		pool.spiralMoving = true;

		pool.tD.leaned = false;

		pool.tD.angleDestiny = -object.angle-0.5*Math.PI;
		pool.tD.angleBySelectedObject = true;
		//c.log( "[selectObjectSE], pool.tD.angleDestiny: ", pool.tD.angleDestiny);

		if(pool.tD.dragged) prepareAnglesToStartFollowing();

		pool.tD.leaned = object.type=='integration';

		pool.tD.dragged = false;
		pool.tD.following = true;
		
		pool.tD.va = 1;

		pool.tD.wideView = object.wideView==null?1:object.wideView;

		switch(object.type){
			case "grade":
				pool.tD.zoomFactor = pool.viewParams.ZOOM_ON_GRADE_FACTOR;
				break;
			default:
				pool.tD.zoomFactor = pool.viewParams.ZOOM_ON_SELECTION_FACTOR;
				break;
		}

	}

	if(pool.isTouch && !MOUSE_UP){
		if(object.angle){
			//c.l('selectObjectSE (pool.isTouch && !MOUSE_UP) ==> call drawTouchComplete');
			
			pool.spiralMoving = true;
			followAngle(-object.angle-0.5*Math.PI, false);

			//drawTouchComplete();
		}
	}

	pool.interaction.nFSelection = nF;

	startCycle();
}



overObjectSE = function(object){
	c.log( "overObjectSE: ", object);

	if(object.type=='grade' && pool.isTouch){
		
		//selectObject(object); //ugly fix, shouldn't be necessary
	
	} else {
		startCycle();
	}
}

unSelectObjectSE = function(){
	//if(pool.isTouch) drawTouchComplete();
}

unOverObjectSE = function(){
	//c.l('unOverObjectSE');
	//if(pool.isTouch) drawTouchComplete();
}