'use strict';

function hideLightboxImage(  )
{
  $("#lightBox").fadeOut();
}

angular.module('angularSpiralApp')
  .filter('getImage', function() {
    return function( data ) {
      if( data.node.image_file_name ){
        // Integrations are an exception
        if( data.node.type == "integration")
          return pool.loading.URL_BASE_IMAGES+"ips/"+data.node.image_file_name;
        else
          return pool.loading.URL_BASE_IMAGES+data.node.typePlural+"/"+data.node.image_file_name;
      }
      return null
    };
  })
  .filter('getYoutubeVideo', function() {
    return function( data ) {
      if( data.node.id == "45" )
        return "//www.youtube.com/embed/36BQW1SuHQ8?rel=0";
      return null
    };
  })
  .filter('getVimeoVideo', function() {
    return function( data ) {
      if( data.node.video_url ){
        //return "//player.vimeo.com/video/88326173";
        return "//player.vimeo.com/video/"+data.node.video_url;
      }
      return null
    };
  })
  .controller('PanelCtrl', function ($scope, $routeParams) {
    //if( !window.pool ) window.pool = {modelObjects:{} };
    window.scopeDetails = $scope;


    // Reset the side panel scroll so that it always shows on top
    $("#panelContainer").scrollTop(0);

    // to-do: this code will just prevent an error on the first load, but the details panel won't show anything
    // This should be better handled; i.e. storing the id, and then using it afterward when Main::endProcess() is executed
    if( !pool.modelObjects.les )
    {
      // doNothing
      $scope.myData = {title:"Error", description:"Models not loaded yet"};
      return;
    }

    if( !pool.history )
    {
      pool.history = [];
      pool.historyIndex = 0;
    }
    $scope.showLightboxImage = function ( data )
    {
      var url = pool.loading.URL_BASE_IMAGES+data.node.typePlural+"/"+data.node.image_file_name;

      $("#lightBox img").attr( "src", url );
      $("#lightBox").fadeIn();
    }


    $scope.stopThreadBlink = function(){
      $(".threadNavRibbon").removeClass("blink");
    }

    $scope.sideBarMouseOver = function( itemId, event )
    {

      var obj = getObjectById( itemId );
      //overObject( obj );
      showTooltipForObject( obj, event.clientX, event.clientY+10 );
    }

    $scope.sideBarMouseOut = function(  )
    {
      console.log( "sideBarMouseOut()");
      unhighlightPanelItem();
    }

    $scope.generateSuperLevelChart = function( node )
    {
      var svg = $("#superlevelChartSVG");
      svg.html();
      var parentItems;
      if( node.type == "le" )
      {
        for (var i = 0; i < node.unit.les.length; i++) {
          var item = node.unit.les[i];
          var gfx_item = svg.append( '<circle cx="'+(5+20*i)+'" cy="20" r="5" fill="red"/>' );
          if( item.id == node.id )
          {
            gfx_item.addClass( "superlevelChartSelected" );
          }
        };
      }
    }

    $scope.graph = {'width': 100, 'height': 100}
  $scope.circles = [
    {'x': 15, 'y': 20, 'r':15},
    {'x': 50, 'y': 60, 'r':20},
    {'x': 80, 'y': 10, 'r':10},
  ]

    // $scope.refreshHistory = function()
    // {
    // }
    // shortcut to toggle list options
    $scope.toggleList = pool.toggleList;
    $scope.onItemOver = function( item )
    {
        // We check if item is valid (it could be null when using the thread navigation arros since they look for two positions ahead of current selected item when clicked)
      if( item ){
          item.overOnPanel = true;
          console.log("onItemOver called from panel");
          overObject(item, true );
      }
    }
    $scope.onItemOut = function(  )
    {
        console.log("onItemOut called from panel");
      // To-do: re-enable when mouse-over management is working
      //return;

      unOverObject();
    }

    $scope.changeToggleList = function( listName, $event )
    {

      $event.preventDefault();
      if( $scope.toggleList[listName] == true )
        $scope.toggleList[listName] = false;
      else
        $scope.toggleList[listName] = true;
      // $scope.$apply();
    }

    // Starts "thread navigation" mode
    $scope.enterThread = function( threadId, $event ){

      if( $event )
        $event.preventDefault();


      $scope.currentThread = getObjectById( threadId );
      pool.currentThread = $scope.currentThread;
      $("#panelContainer").scrollTop(0);
      $("#panelContainer").css("background-color",  "#fff");

       setTimeout( function(){
         //$( ".threadNavRibbon" ).pulse({opacity: 0.1}, {duration : 200, pulses : 3});
        $(".threadNavRibbon").addClass("blink");
       }, 100 );
    }

    // If there's data to be shown...
    var node = getObjectById( $routeParams.index );

    // If curent node s thread, and its toggleList has not been set yet, make is show up
    if( node && node.type == "thread" )
    {
      $scope.toggleList["les"] = true;
    }

    // Pass current thread to scope (or reset if needed)
    if( pool.currentThread && node && (node.type == "le" || node.type == "integration" ) && node.threads && node.threads.length > 0 )
    {
      var nodeBelongsToCurrentThread = false;
      for (var i = 0; i < node.threads.length; i++) {
        var thread = node.threads[i];
        if( thread == pool.currentThread ){
          nodeBelongsToCurrentThread = true;
          break;
        }
      };
      if( nodeBelongsToCurrentThread )
      {
        // let the scope know about currentThread
        $scope.currentThread = pool.currentThread;
      }else{
        pool.currentThread = undefined; // reset current thread
        $scope.currentThread = pool.currentThread;
        $("#panelContainer").css("background-color",  "");
      }

    }else{
      pool.currentThread = undefined; // reset current thread
      $scope.currentThread = pool.currentThread;
      $("#panelContainer").css("background-color",  "");
    }

    if( node )
    {
      // Assign integrated projects if node is a unit
      if( node.type == "unit"){
        var u = node;
        $scope.injectedIPs = [];
        pool.modelObjects.integrations.forEach(function(d,i){
          if( d.unit == u ){
            console.log( "injecting IP " + d.id + " in unit " + u.id );
            $scope.injectedIPs.push( d );
          }
        })
      }

      var existsAlready = false;
      for( var i=pool.history.length-1; i>=0; i-- )
      {
        if( node == pool.history[i] )
        {
          pool.historyIndex = i;
          $scope.historyIndex = i;
          existsAlready = true;
          break;
        }
      }
      if( !existsAlready )
      {
        pool.history.push( node );
        pool.historyIndex = pool.history.length-1;

      }
        $scope.history = pool.history;
        $scope.historyIndex = pool.historyIndex;

      // Get subdomains
      if( node.type == "domain" ){
        var doms = pool.modelObjects.domains;
        var subdoms = [];
        for( var i=0; i<doms.length; i++ )
        {
          var parent_id = doms[i].parent_id;
          if( parent_id && parent_id != 0 ){
            parent_id = "d_" + parent_id;
            var parent = getObjectById( parent_id );

            if( parent && parent == node ){
              subdoms.push( doms[i] );
            }
          }
        }
        $scope.subdomains = subdoms;
      }



      var list_unit =[ "ecology", "mentality", "bifurcation", "grade", "domain", "course", "unit", "le", "thread", "integration", "outcome_eu", "eu", "outcome", "standard" ];
      var list_multi =[ "ecologies", "mentalities", "bifurcations", "grades", "domains", "courses", "units", "les", "threads", "integrations", "outcome_eus", "eus", "outcomes", "standards" ];

      // "Assessments" are an exception
      var typeTitle;
      if( node.le_type == "AS")
        typeTitle = pool.typeTitles.assessment;
      else
        typeTitle = pool.typeTitles[ node.type ];


      $scope.myData = { properties:{}, node:node, list_unit:list_unit, list_multi:list_multi, typeTitle:typeTitle };

      // Let the LE know its palce in its threads
      if( (node.type == "le" || node.type == "integration") && node.threads )
      {
          $scope.myData.indexInThread = {};
          for (var i = 0; i < node.threads.length; i++) {
            var thread = node.threads[i];
            $scope.myData.indexInThread[ thread.id ] = node.threads[i].les.indexOf( node );

          };
      }

      // Get node fields
      var panelsTable = pool.tables.panelsTable;
      for( var i=0; i<panelsTable.length; i++ )
      {
        var column = panelsTable[i];
        // appropiate column found
        if( column.name == node.type )
        {
          for( var i=0; i<column.length; i++ )
          {
            var value = column[i];
            if( value != "" )
            {
              var propertyName = panelsTable[0][i];
              var propValue = node[propertyName];
              if( propValue )
              {
                if( value == "string")
                  $scope.myData.properties[propertyName] = propValue;
                else
                  $scope.myData.properties[propertyName] = propValue;
              }
            }
          }
        }
      }
      // Change selected node if it's different than the currently selected
      // (this controller is being created by the router when the URL is changed)
      if( pool.objectsInteraction.selectedObject != node )
        selectObject( node );

        // draw flower

          var canvas = $("#panelFlower");
          if( canvas.length > 0 && node.domains != null )
          {
            var context = canvas[0].getContext("2d");
            drawDomainsFlower( node, context, 40, 40, 40 );
          }


        // Append Central Point data if available
        var nodeId = node.id;
        var centralPointId = pool.centralPointUrls[ nodeId ];
        console.log( "centralPoint ID: " + centralPointId, nodeId, centralPointId != "" && centralPointId != null );
        if( centralPointId != "" && centralPointId != "\r"  && centralPointId != undefined ){
            var centralPointLink = pool.loading.URL_CENTRAL_POINT_BASEPATH + centralPointId;
            $scope.centralPointLink = centralPointLink;
            console.log( "centralPoint Link: " + centralPointLink );
        }



    }
    else
    {
      console.log( "Error fetching node #" + $routeParams.index );
      $scope.myData = {title:"Error", description:"Node " + $routeParams.index + " not found"};
    }

    // Hide infopanel if the cookie/localStorage says so
    if( !pool.infoPanelInitialized )
    {
      pool.infoPanelInitialized = true;
      if( pool.viewParams.PANEL_OPEN == false )
        hideInfoPanel();
    }
    setTimeout( function(){
      $(".panelField_description").scrollTop(1);
      //$scope.generateSuperLevelChart($scope.myData.node);
    }, 1000 );
  });
