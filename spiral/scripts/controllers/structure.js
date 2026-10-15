'use strict';

angular.module('angularSpiralApp')
  .controller('StructureCtrl', function ($scope) {

    $scope.getGradesSummary = function()
    {
      var result = [];
      pool.modelObjects.grades.forEach(function(d,it){
        var numCourses = d.courses != undefined ? d.courses.length: 0;
        var numUnits = 0;
        var numLes = 0;
        if( numCourses > 0 ){
          for( var i=0; i<d.courses.length; i++ )
          {
            var currentUnits = d.courses[i].units != undefined ? d.courses[i].units.length: 0;
            numUnits += currentUnits;
            if( currentUnits > 0 ){
               for( var j=0; j<d.courses[i].units.length; j++ )
               {
                 numLes += d.courses[i].units[j].les != undefined ? d.courses[i].units[j].les.length: 0;
               }
            }
          }
         }
            
        
        result.push({
          id: d.id, 
          grade_name: d.grade_name, 
          title: d.title, 
          numCourses: numCourses, 
          numUnits: numUnits, 
          numLes: numLes
        });
      });
      return result;
    }

   

  	if( !pool.modelObjects.grades )
    {
      // doNothing
      $scope.myData = {title:"Error", description:"Models not loaded yet"};
      return;
    }

    $scope.gradesSummary = $scope.getGradesSummary();
    $scope.maxLesPerGrade = _.max( $scope.getGradesSummary(), function(grade){ return grade.numLes; }).numLes;
    // $scope.gradesSummary.forEach(function(d,i){
    //   d.numLes = Math.floor(Math.random()*80); //( d.numLes/$scope.maxLesPerGrade*50 )+ "px";
    // })

    $scope.modelObjects = pool.modelObjects;
    $scope.lists = {};
    $scope.lists.grades = pool.modelObjects.grades;
    $scope.lists.domains = pool.modelObjects.domains;
    $scope.lists.threads = pool.modelObjects.threads;
    $scope.lists.ecologies = pool.modelObjects.ecologies;
    $scope.lists.mentalities = pool.modelObjects.mentalities;
    $scope.lists.courses = pool.modelObjects.courses;
    
  });
