

$(document).mousemove(function(e) {
  var mX = e.clientX || e.pageX;
  var mY = e.clientY || e.pageY;
  updateTooltipPosition( mX, mY );
})


function initSidePanelContaner(){
  $("#panelSuperContainer").css( "display", "block" );
};


// Handle roll-over event originated in panel
// ---------------------------------------------
function objectOveredInPanel(id)
{
  var object = getObjectById( id );
  object.overOnPanel = true;
  overObject( object, true );
}


// Handle roll-out event originated in panel
// ---------------------------------------------
function objectOutedInPanel()
{
  unOverObject();
}

// Show info panel
// ---------------------------------------------
function showInfoPanel()
{
  $("#panelSuperContainer").animate( 
    { right: "0px" }, 
    {
      step: function( now, fx ) {
        pool.frames.wPanel = 440 + now;
        onResize();
      }
    }, 
    function(){
      pool.frames.wPanel = 440;
      onResize();
    } 
  );
  $("#paneltoggler").removeClass( "icon-circle-arrow-left" );
  $("#paneltoggler").addClass( "icon-circle-arrow-right" );
  pool.viewParams.PANEL_OPEN = true;
  writeCookie();
}

// Hide Info panel
// ---------------------------------------------
function hideInfoPanel()
{
  $("#panelSuperContainer").animate( 
      { right: "-415px" }, 
      {
        step: function( now, fx ) {
          pool.frames.wPanel = 440 + now;
          onResize();
        }
      }, 
      function(){
        pool.frames.wPanel = 440 - 395;
        onResize();
      } 
    );
  $("#paneltoggler").removeClass( "icon-circle-arrow-right" );
  $("#paneltoggler").addClass( "icon-circle-arrow-left" );
  pool.viewParams.PANEL_OPEN = false;
  writeCookie();
}


function toggleInfoPanel(  )
{
  if( pool.viewParams.PANEL_OPEN ){
    hideInfoPanel();
  }else{
    showInfoPanel();
  }
}