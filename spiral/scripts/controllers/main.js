'use strict';

angular.module('angularSpiralApp')
  .controller('MainCtrl', function ($scope, $routeParams, $location ) {
    var validTables = [ "domains", "grades", "threads", "ecologies", "mentalities" ];
  	if( !pool.modelObjects.grades )
    {
      // doNothing
      $scope.myData = {title:"Error", description:"Models not loaded yet"};
      return;
    }

    $scope.type_descriptions = pool.descriptions;

    $scope.lists = {};
    $scope.lists.grades = pool.modelObjects.grades;
    $scope.lists.domains = pool.modelObjects.domains;
    $scope.lists.threads = pool.modelObjects.threads;
    $scope.lists.ecologies = pool.modelObjects.ecologies;
    $scope.lists.mentalities = pool.modelObjects.mentalities;

      $scope.searchTerm = window.searchTerm;
      if( $scope.searchTerm != undefined && $scope.searchTerm != "" )
        $scope.showSearchResults = false;
    
    setTimeout( function(){
      for( var i=0; i<$scope.lists.domains.length; i++ )
      {
        var domain = $scope.lists.domains[i];
        // to-do: remove this "if" and handle subdomains correctly
        if( !domain )
          continue;
        var canvas = $("#panelFlower_"+domain.id);
        if( canvas.length > 0 )
        {
          var context = canvas[0].getContext("2d");
          var dummyObject = {domains:[domain]};
          drawDomainsFlower( dummyObject, context, 15, 15, 15 );
        }
      }

      $scope.clearSearchResults = function($event){
        $event.preventDefault();
        $scope.showSearchResults = false;
        window.searchTerm = $scope.searchTerm = "";
      }

      $scope.seachByText = function(){
        if( $scope.searchTerm == undefined || $scope.searchTerm.length < 3 ){
          alert( "Please type at least 3 chracters to search");
          return;
        }
        $scope.showSearchResults = true;
        window.searchTerm = $scope.searchTerm;
        var searchString = $scope.searchTerm.toLowerCase(); //$("#srch-term").val().toLowerCase();
        console.log( "Will search this term: " + searchString );

        /*
        var results = {
          les: [], 
          units: [], 
          courses: []
        };
        for( var p in results ){
          for (var i = 0; i < pool.modelObjects[p].length; i++) {
            var element = pool.modelObjects[p][i];
            var name = element.title.toLowerCase();
            var description = element.description.toLowerCase();
            if( name.indexOf(searchString) > -1 ){
              results[p].push( element );
            }          
          }
        }
        */

        var resultTree = [];
        resultTree.totalNumResults = 0;
        for (var i = 0; i < pool.modelObjects.courses.length; i++) {
          var courseInserted = false;
            var course = pool.modelObjects.courses[i];
            var course_name = course.title.toLowerCase();
            var searchTextRegExp = new RegExp(searchString , "i");
            var courseTitleHighlighted = course.title.replace(searchTextRegExp , '<span style="background-color: #f3eeb2">$&</span>');
            //var course_description = course.description.toLowerCase();
            if( course_name.indexOf(searchString) > -1 ){
              if( !courseInserted ){                
                courseInserted = { id:course.id, title:course.title, titleHighlighted:courseTitleHighlighted, object:course, units:[], directFind:true }; 
                resultTree.push( courseInserted );
                resultTree.totalNumResults++;
              }
            }    
            var units = course.units;   
            for (var j = 0; j <units.length; j++) { 
              var unitInserted = false;  
              var unit = units[j];
              var unit_name = unit.title.toLowerCase();
              //var searchTextRegExp = new RegExp(searchString , "i");
              var unitTitleHighlighted = unit.title.replace(searchTextRegExp , '<span style="background-color: #f3eeb2">$&</span>');
              //var unit_description = unit.description.toLowerCase();
              if( unit_name.indexOf(searchString) > -1 ){
                if( !unitInserted ){
                    //var searchTextRegExp = new RegExp(searchString , "i");
                    //var unitTitleHighlighted = unit.title.replace(searchTextRegExp , '<span style="background-color: #f3eeb2">$&</span>');
                  unitInserted = { id:unit.id, title:unit.title, titleHighlighted:unitTitleHighlighted, object:unit, les:[], directFind:true };
                  if( !courseInserted ){
                    courseInserted = { id:course.id, title:course.title, titleHighlighted:courseTitleHighlighted, object:course, units:[] }; 
                    resultTree.push( courseInserted );
                  }
                  courseInserted.units.push( unitInserted );
                  resultTree.totalNumResults++;
                }
              }    
              var les = unit.les;      
              for (var k = 0; k <les.length; k++) { 
                var leInserted = false;  
                var le = les[k];
                var le_name = le.title.toLowerCase();
                //var le_description = le.description.toLowerCase();
                // We search for string matching but also for the exception of "Integrated Project". We want users to be able to find them by type, not by name
                if( le_name.indexOf(searchString) > -1 || ( searchString == "integrated project" && le.type == "integration") ){
                  if( !leInserted ){
                    //var searchTextRegExp = new RegExp(searchString , "i");
                    var leTitleHighlighted = le.title.replace(searchTextRegExp , '<span style="background-color: #f3eeb2">$&</span>');
                    leInserted = { id:le.id, title:le.title, titleHighlighted:leTitleHighlighted, object:le, les:[], directFind:true };
                    if( !courseInserted ){
                      courseInserted = { id:course.id, title:course.title, titleHighlighted:courseTitleHighlighted, object:course, units:[] }; 
                      resultTree.push( courseInserted );
                    }
                    if( !unitInserted ){
                      unitInserted = { id:unit.id, title:unit.title, titleHighlighted:unitTitleHighlighted, object:unit, les:[] }; 
                      courseInserted.units.push( unitInserted );
                    }
                    unitInserted.les.push( leInserted );
                    resultTree.totalNumResults++;
                  }
                }       
              }
            }
          }

        //$scope.searchResults = results;
        $scope.searchResultsTree = resultTree;
        //console.log( "Search results: " );
        //console.log( resultTree );
      };


      $scope.currentTable = $routeParams.table || "domains";
      if( validTables.indexOf( $scope.currentTable ) == -1 && $scope.currentTable != "domains" ){
        window.location.hash =( "#/home/domains");  
        return;
      }

      var selector = "#infoPanelTabList a[id='tabItem_"+$scope.currentTable+"']";
      
      $scope.currentTable = $scope.currentTable;
      $( selector ).tab("show");

      if( $scope.searchTerm != undefined && $scope.searchTerm != "" ){
        $scope.seachByText();
        $scope.$apply();
      }

      // Refresh the spiral
      //unSelectObject();
      
      
    }, 200 );
    

    $('#infoPanelTabList a').click(function (e) {
      e.preventDefault();
      var dataid = $(this).attr("dataid");
      
      //$location.path( "/home/" + href );
      window.location.hash =( "#/home/" + dataid );  
      //$(this).tab('show')
    });

    

    // Hide infopanel if the cookie/localStorage says so
    if( !pool.infoPanelInitialized )
    {
      pool.infoPanelInitialized = true;
      if( pool.viewParams.PANEL_OPEN == false )
        hideInfoPanel();
    }
  });
