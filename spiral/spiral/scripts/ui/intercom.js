
/* ******************************************************
                Internal communication
****************************************************** */

function overObjectPanel( object, hideTooltip ){
  if( !MOUSE_IN_DOCUMENT )
    return;
  
  var passCoordinates = pool.frames.mouseInCanvas || !object.visible;
  highlightPanelItem( object );
  if(!hideTooltip){
     showTooltipForObject();
    showTooltipForObject( object, passCoordinates?null:object.x, passCoordinates?null:object.y );
  }
}

function unOverObjectPanel(  ){
  unhighlightPanelItem(  );
}


function highlightPanelItem( object )
{
  $(".panelField_OVER").removeClass("panelField_OVER");
  var element = $("a[href='#/"+object.type+"/"+object.id+"']");
  element.addClass( "panelField_OVER" );
  
    //showTooltipForObject( object, x, y );
}
function unhighlightPanelItem( )
{
  $(".panelField_OVER").removeClass("panelField_OVER")
  showTooltipForObject( null);
   if( !pool.panel )
     return;
  pool.panel.highlightedElement = null;
}
