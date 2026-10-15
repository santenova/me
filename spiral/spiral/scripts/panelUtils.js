InfoPanel = {

	trackMouseMovements: function()
	{
		$("#panelSubContainer").mousemove( function(event){
	    if( pool.frames.mouseInCanvas != false )
	    {
	      pool.frames.mouseInCanvas = false;
	      //console.log( "mouseInCanvas changed to FALSE" );
	    }
	  });
		// Remove this return to re-enable roll-overing
		return;
	  // handle mouse over in panel's links
	  $( "#panelSubContainer").on("mouseover", "a", function(){ 
	    var identifier = $(this).attr( "db-id");
	    if( identifier ){
	      var id = identifier; //identifier.split("-")[2];
	      if( id ){
	        var node = getObjectById( id );
	        if( node ){
	          if( !pool.panel )
	            pool.panel = {}
	          pool.panel.highlightedElement = node;
	          overObject( node );
	        }else{
	          console.log( "WARNING!: Overed item " + identifier + " has not related object");
	        }
	      }else{
	        console.log( "WARNING!: overed item id is not properly formatted" );
	      }
	    }else{
	      console.log( "WARNING!: overed item has no id ");
	    }
	  });

	   // handle mouse over in panel's links
	  $( "#panelSubContainer").on("mouseout", "a", function(){ 
	    var identifier = $(this).attr( "db-id");
	    if( identifier ){
	      var id = identifier; //identifier.split("-")[2];
	      if( id ){
	        var node = getObjectById( id );
	        if( node ){
	          unOverObject( node );
	        }else{
	          console.log( "WARNING!: unovered item " + identifier + " has not related object");
	        }
	      }else{
	        console.log( "WARNING!: unovered item id is not properly formatted" );
	      }
	    }else{
	      console.log( "WARNING!: unovered item has no id ");
	    }
	  });
	}

};