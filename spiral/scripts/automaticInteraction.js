/*
    This object provides a mechanism to simulate user interactions in a sequential way.
    It is inteded to be used on idle time (when user hasn't interacted with the app for a while)
    so that it shows the different features and contents and tries to drag attention.
    It can be useful mostly in public venues such as interactive kiosks in expos, receptions, etc...
*/
var autoDriver = 
{
    isOn: false,

    init: function()
    {
      autoDriver.isOn = true;
      autoDriver.stepIndex = 0;
      var cursor = autoDriver.cursor = $("#fakeCursor");
      cursor.css( "display", "block" );

      autoDriver.steps = [

        // Make sure collapsable menus are visible
        function(){ 
          pool.toggleList['courses'] = true;
          pool.toggleList['units'] = true;
          pool.toggleList['les'] = true;
          autoDriver.runNextStep(); 
        }, 

        function(){ 
          unSelectObject();
          setTimeout( function(){
            autoDriver.runNextStep();
          }, 200 ); 
        }, 
        // Tabs showcase
        function(){ autoDriver.movetoAndClick( $("#tabItem_mentalities" ), false, null, 1000, 1000 ); }, 
        function(){ autoDriver.movetoAndClick( $("#tabItem_ecologies" ), false, null, 1000, 300 ); }, 
        function(){ autoDriver.movetoAndClick( $("#tabItem_threads" ), false, null, 1000, 300 ); }, 
        function(){ autoDriver.movetoAndClick( $("#tabItem_grades" ), false, null, 1000, 300 ); }, 
        function(){ autoDriver.movetoAndClick( $("#tabItem_domains" ), true, null, 1000, 300 ); }, 
        function(){ autoDriver.scrollDown(  ); },

        
        // Drill down hyerarchy to LE
        function(){ autoDriver.movetoAndClick( $('a[db-id="d_1"]'), true ); },                          // Choose Domain Petal 'Cultural History'


        function(){ autoDriver.movetoAndClick( $("a[href='#/course/c_50']"), true ); },                 // Choose COURSE
        function(){ autoDriver.movetoAndClick( $("a[href='#/unit/u_306']"), true ); },                  // Choose UNIT     
        function(){ autoDriver.movetoAndClick( $( $(".panelField_les ul li a").get(3) ), true ); },     // move to LE, wait and click        
        
        // Move mouse canvas, emulate click nowhere
        function(){
          setTimeout( function(){
            cursor.animate( {left:cW-400, top:500}, 1000, autoDriver.runNextStep )
          }, 1000 );
        }, 
        // wait and unselect
        function(){
            unSelectObject();
          setTimeout( function(){
            autoDriver.runNextStep()
          }, 1000 );
        }, 

        function(){ autoDriver.movetoAndClick( $("#tabItem_threads" ), true ); },           // Threads tab
        function(){ autoDriver.movetoAndClick( $("a[href='#/thread/t_10']"), true ); },         // Choose Sustainability thread
        function(){ autoDriver.movetoAndClick( $( $("a[href='#/le/2096']").get(0) ) ); },         // move to first LE, wait and click
        
        // move to right arrow wait and click
        function(){ autoDriver.movetoAndClick( $("#threadNavArrowRight") ); },
        function(){ autoDriver.movetoAndClick( $("#threadNavArrowRight"), false, 0, 3000 ); },
        function(){ autoDriver.movetoAndClick( $("#threadNavArrowRight"), false, 0, 3000 ); },
        function(){ autoDriver.movetoAndClick( $("#threadNavArrowRight"), false, 0, 3000 ); },
        function(){ autoDriver.movetoAndClick( $("#threadNavArrowRight"), false, 0, 3000 ); },
        function(){ autoDriver.movetoAndClick( $("#threadNavArrowRight"), false, 0, 3000 ); }, 
        
        function(){ cursor.animate( {top:"10px", left:"10px"}, 1000, autoDriver.runNextStep ) },
      ];
      autoDriver.runNextStep();
    }, 


    movetoAndClick: function( selector, afterScroll, timeToClick, timeToNext, animationTime ){
        console.log( "[AutoPilot]", selector, afterScroll, timeToClick, timeToNext, animationTime );
        if( timeToClick == null ) timeToClick = 100;
        if( timeToNext == null ) timeToNext = 500;
        if( animationTime == null ) animationTime = 1000;
        var el = $( selector );
        var el_pos = el.offset();
        autoDriver.cursor.animate( {top:el_pos.top+10, left:el_pos.left+30}, animationTime, function(){
            setTimeout( function(){
                el.click();
                setTimeout( function(){
                    if( afterScroll )
                        autoDriver.scrollDown();
                    else
                        autoDriver.runNextStep();
                }, timeToNext );
            }, timeToClick );
        });
    }, 


    scrollDown: function( animationTime ){
        if( animationTime == null ) animationTime = 1000;
        //setTimeout( function(){
            $("#panelContainer").animate( { scrollTop:300 }, animationTime, autoDriver.runNextStep );
        //}, 0 );
    },



    runNextStep: function(){
        if( autoDriver.stepIndex >= autoDriver.steps.length ){
            console.log( "done auto" );
            autoDriver.isOn = false;
            return null; // finished
        }
        var nextFunction = autoDriver.steps[ autoDriver.stepIndex ];
        autoDriver.stepIndex++;
        nextFunction();
    }
};