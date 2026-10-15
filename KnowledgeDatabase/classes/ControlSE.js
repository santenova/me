selectObjectSE = function(object){

  c.log( "selectObjectSE: ",  object.type + ", " + object.id);

  if(object.angle!=null && !pool.isTouch){
    pool.spiralMoving = true;

    pool.tD.leaned = false;

    pool.tD.angleDestiny = -object.angle-0.5*Math.PI;

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



  if(! undefined object.list_of_LE_ids)  object.list_of_LE_ids.split("|").forEach(function(e){


        var o = getObjectById( e );
        if( o )
        {
          if(o.title) c.log( ""+e+": ", o.title);
        }
        });


  [object.id].forEach(function(e){


    var node = getObjectById( e );
    if( node )
    {

    if(node.title) c.log( "\n\n\n"+e+": ", node.title);




    }
    });



  startCycle();
}

unSelectObjectSE = function(){
  //if(pool.isTouch) drawTouchComplete();
}

unOverObjectSE = function(){
  //c.l('unOverObjectSE');
  //if(pool.isTouch) drawTouchComplete();
}
