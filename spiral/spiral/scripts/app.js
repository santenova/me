'use strict';

// Capture global mouse state
/*
$('body').mousemove(function() {
  console.log( "globalMouse: IN BODY move");
  pool.mouseInViewport = true;
})
$('body').mouseenter(function() {
  console.log( "globalMouse: IN BODY");
  pool.mouseInViewport = true;
})
*/
// $('body').on('mouseleave', function(){
//   console.log( "OUTTTTTT");
// })


  // Create the module
  var app =  angular.module('angularSpiralApp', []);

  // Register filter to make dates human-readable
  app.filter( "bigDateFormat", function(){
    return function(value){
      // Make sure it's a number
      value = parseInt(value);
      // Remove sign
      var absValue = Math.abs(value);

      // Put commas only on big dates (i.e. not in 1984)
      var formattedValue;
      if( absValue < 10000 )
        formattedValue = absValue;
      else
        formattedValue = _.string.numberFormat( (absValue) );

      // Add CE / BCE appropiately
      if( value < 0 )
        return formattedValue + " BCE";
      else
        return formattedValue + " CE";
    }
  })




/* ******************************************************
                  Routing / Navigation
****************************************************** */
function initializeAngularApp(){
  // Handle mouse move to inform spiral
  InfoPanel.trackMouseMovements();

  app.config( ['$routeProvider', function ($routeProvider) {
    $routeProvider
          .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
          .when('/home/:table', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
          .when('/:table/:index', {
            templateUrl: 'views/infoPanel.html',
            controller: 'PanelCtrl'
          })
          .when('/structure', {
            templateUrl: 'views/structure.html',
            controller: 'StructureCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
  }]);
  angular.bootstrap(document, ["angularSpiralApp"]);
};


// Function to navigate to object
function jumpToObject( object )
{
  if( object )
  {
    if( object.destiny ){
      window.scopeDetails.enterThread( object.thread.id );
      selectObject( object.destiny );
    }
    else
    {
      window.location.hash =( "#/" + object.type + "/" + object.id );  
    }
  }
  else
  {
      pool.currentThread = undefined;
      window.location.hash = "#/" ;  
  }
}



/* Only used for debugging purpoes (to avoid the need of clearing cache/cookies) */
function resetLocalStorage()
{
  localStorage.removeItem("LAST_OPEN_DATE");
  localStorage.removeItem("OPEN_COUNT");
  localStorage.removeItem("PANEL_OPEN");
  localStorage.removeItem("RULER_STATE"); 
}
