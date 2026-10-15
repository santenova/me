function showTooltipForObject( object, x, y )
{


  if( !object || pool.isTouch )
  {
    pool.tooltipObject = null;
    $("#generalTooltip").css( "display", "none" );
    return;
  }
  if( pool.tooltipObject != object )
  {
    $("#generalTooltip").css( "display", "none" );
    pool.tooltipObject = object;
    var html = "";

    if( object.domain ){
      html += '<div>';
      html += '<div ng-show="myData.node.grade" class="panelField" style="float:right; font-size: 13px; margin-bottom: 0px; margin-left: 20px;">';
      html +=  object.grade.grade_name;
      html += '</div>';

      var domainTitle = object.domain.title;

      // HAndle subdomain case. By now all subdomains are children of WLL, and it shouldn't happen
      // To-do: maybe unhardcode this, but not worth it ATM
      if( domainTitle.indexOf( ":" ) > 0 ){
        domainTitle = " WLL: " + domainTitle.split(":")[1];
      }

      if( object.domains )
      {
        html += '<div ng-show="myData.node.domain" class="panelField" style="float:left; font-size: 13px; margin-bottom: 10px; margin-left: 20px;">';
        html += domainTitle;
        html += '</div>';
      }else{
        html += '<div ng-show="myData.node.domain" class="panelField" style="float:left; font-size: 13px; margin-bottom: 10px; margin-left: 0px;">';
        html += '  <font style="color: ' + object.domain.color + '; opacity: 0.6;">•</font> ' + domainTitle;
        html += '</div>';
      }


      html += '</div>';
    }
    html += '<div style="font-size: 12px; color: #999; clear: both; " class="ng-binding">';
    if( object.type == "toLE" )
      html += 'Navigate to Learning Experience<br/>via <i>' + object.thread.title + '</i> thread:';
    else{
      if( object.le_type == "AS")
        html += pool.typeTitles.assessment + ':';
      else
        html += pool.typeTitles[ object.type ] + ':';
    }
    html += '</div>';
    html += "<div class='panelField_title' style='  margin-top: 0px; font-size:18px; margin-bottom:10px; clear: both;'>"
    html += object.titleHtml;

    html +=  "</div>";
    if( object.domains && object.domain ){
      html += '<canvas id="tooltipFlower" width="24" height="24"></canvas>';
     }

    //$("#generalTooltip .tooltipContent").html( html );


      $("#generalTooltip .tooltipContent").html( html) ;
    setTimeout( function(){
      $("#generalTooltip").css( "display", "block" );

	    if( object.domains && object.domain ){
	      var canvas = $("#tooltipFlower");
	      var context = canvas[0].getContext("2d");
	      drawDomainsFlower( object, context, 12, 12, 12 );
	    }
  		updateTooltipPosition(x,y);
    }, 1 )




  }


}




function updateTooltipPosition(x,y)
{
  //$("#generalTooltip .tooltipContent").html( $("#generalTooltip .tooltipContent").html() );
  var gt = $("#generalTooltip");
  var gtState = $("#generalTooltip").css( "display");
  if( gtState == "none" )
    return;



  var gBox = $("#tooltipBox");
  var gtHeight = gt.height();
  var gtWidth = gt.width();
  var sidePanelX = $("#panelSuperContainer").position().left; // window.innerWidth
  // Right border
  var mX, mY;
  if( x && y )
  {
    mX = x;
    mY = y;

  }else{
    mX = window.mX;
    mY = window.mY;
  }

  var arrowOrientation;
  var destLeft;
  var destTop;
  if( mX > sidePanelX-gtWidth ){
    // top border
    if( mY < gtHeight+20+50 ){
      destLeft = (mX-302)+"px";
      destTop = (mY+20)+"px";
      arrowOrientation = "arrow_box_left_top";
    }else{
      destLeft = (mX-302)+"px";
      destTop = (mY-gtHeight-20)+"px" ;
      arrowOrientation = "arrow_box_left";

    }
    // Left border
  }else{
    // top border
    if( mY < gtHeight+20 ){
      destLeft = (mX-22)+"px" ;
      destTop = (mY+20)+"px" ;
      arrowOrientation = "arrow_box_top";
    }else{
      destLeft = (mX-22)+"px";
      destTop = (mY-gtHeight-20)+"px";
      arrowOrientation = "arrow_box";
    }
  }


  if( pool.arrowOrientation != arrowOrientation )
  {

    $("#generalTooltip").css( "display", "none" );
	gBox.removeClass(  );
    gBox.addClass( arrowOrientation );
    setTimeout( function(){
    	$("#generalTooltip").css( "display", "block" );
    	pool.arrowOrientation = arrowOrientation
    }, 1 );

  }

      gt.css( "left", destLeft );
      gt.css( "top", destTop );
}
