/* 
  Start the help layout. Will make it display if it's one of the first times
  the user visits the app (based on a cookie)
*/
function initHelp()
{
  var openCount = Number( pool.viewParams.OPEN_COUNT || 0 );
  var lastOpenDate = Number( pool.viewParams.LAST_OPEN_DATE || 0 );
  lastOpenDate = new Date( lastOpenDate ).getTime();
  var today = new Date().getTime();
  var timeDiff = (today-lastOpenDate)/1000/60/60/24;
  
  if( pool.viewParams.OPEN_COUNT < 5 || timeDiff>30 ){
    openHelp();
  }
  pool.viewParams.OPEN_COUNT++;
  pool.viewParams.LAST_OPEN_DATE = today;
  writeCookie();
}



// Handle the "open help" action (triggered by the "?" icon)
// ---------------------------------------------
function openHelp()
{
  showInfoPanel();
  if( !pool.isTouch )
    pool.viewParams.RULER_STATE = 2;
  repositionHelpElements();
  $("#mainHelp").fadeIn();
}



// Will recalculate the help layout based on the screen size 
// (i.e. triggered on screen resize event)
// ---------------------------------------------
function repositionHelpElements()
{
  // Grades hint
  var gradeHeight = $("#main").height()/13;
  var posYGrade = ( (gradeHeight*3)+(gradeHeight/2) );
  var gradeImageHeight = parseInt( $(".helpTip_03").css("height") );
  var halfGradeImageHeight = gradeImageHeight/2;
  var posYGrade =  posYGrade - halfGradeImageHeight;
  $(".helpTip_03").css("top", posYGrade+"px");

  // Units hint
  var posYGrade = ( (gradeHeight*10)+(gradeHeight/2) );
  var gradeImageHeight = parseInt( $(".helpTip_04").css("height") );
  var halfGradeImageHeight = gradeImageHeight/2;
  var posYGrade =  posYGrade - halfGradeImageHeight;
  $(".helpTip_04").css("top", posYGrade+"px");
}


// Handle video switching in help layer (actually not used anymore since finally we're using only one video)
// ---------------------------------------------
function switchHelpLayer(id)
{
  // Reset current video
  pool.currentHelp = id;
  var $frame = $('iframe#videoFrame_' + pool.helpItemSelectedId);
  var vidsrc = $frame.attr('src');
  $frame.attr('src',''); 
  $frame.attr('src', vidsrc);

  // Show the newly selected one
  pool.helpItemSelectedId = id;
  $(".helpGroup").css("display", "none" );
  $("#"+id).fadeIn();
  if( id == "helpHintsLayer" ){
    $("#helpMenuBtn_helpHintsLayer").css("display", "none" );
    $("#helpMenuBtn_helpInteractionLayer").css("display", "inline" );
  }else if( id == "helpInteractionLayer" ){
    $("#helpMenuBtn_helpHintsLayer").css("display", "inline" );
    $("#helpMenuBtn_helpInteractionLayer").css("display", "none" );
  }
}


// Stop Help video being played
// ---------------------------------------------
function resetHelpVideos()
{
    // Reset 1st video
    var $frame = $('iframe#videoFrame_helpInteractionLayer');
    var vidsrc = $frame.attr('src');
    $frame.attr('src',''); 
    $frame.attr('src', vidsrc);

    // Reset 2nd video
    var $frame = $('iframe#videoFrame_helpCurriculumLayer');
    var vidsrc = $frame.attr('src');
    $frame.attr('src',''); 
    $frame.attr('src', vidsrc);
}


// Handle a click anywhere within the help layer to close it and stop video being played
// ---------------------------------------------
$("#mainHelp").click(function(e){
  
  if( e.target == e.currentTarget )
  {
    $("#mainHelp").fadeOut();

    resetHelpVideos();
  }
});

