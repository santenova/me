
function sortLEsByTree( les, listName )
{
  var ids_before = [];
  var ids_after = [];
  for (var i = 0; i < les.length; i++) {
    var le = les[i];
    ids_before.push( le.id );
    le.__sorter_order = le.order;
    le.__sorter_unit = le.unit.order;
    le.__sorter_course = le.course.order;
    le.__sorter_grade = le.grade.order;
  };
  les.sort( dynamicSortMultiple( "__sorter_grade", "__sorter_course", "__sorter_unit", "__sorter_order", "id" ) );
  
  for (var i = 0; i < les.length; i++) {
    var le = les[i];
    ids_after.push( le.id );
  };
  var ids_changed = 0;
  var ids_unchanged = 0;
  for (var i = 0; i < ids_after.length; i++) {
    if( ids_before[i] != ids_after[i] )
    {
      ids_changed++;
    }else{
      ids_unchanged++;
    }
  };
}

/* Array sorting util functions */

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function dynamicSortMultiple() {
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}


function reorderLesInThreads()
{
  var threads = pool.modelObjects.threads;
  for (var j = 0; j < threads.length; j++) {
    var thread = threads[j];
    var les = thread.les;
    for( var i=0; i<les.length; i++ ){
       var le = les[i];
       le.__sorter_indexInLeList = pool.modelObjects.les.indexOf( le );
    }
    les.sort( dynamicSortMultiple( "__sorter_indexInLeList" ) );
  };
 
}





/* ************** THREAD PRUNNING ********************** */


function pruneThreads(){
  pool.modelObjects.threads.forEach(function(t,i){
    pruneThread( t );
  })
}

function pruneThread_OLD_N_SIMPLE(t)
{
  var k = 1;
  var maxLEs = Math.floor( k * Math.sqrt(t.les.length) );
    if( true )
    {
      var step = Math.floor( t.les.length / maxLEs );
      var values = new List();
      for (var i = 0; i < maxLEs; i++) {
        values.push( t.les[i*step] );
      };
      t.les = values;
    }
}

function pruneThread(t)
{
  // Create a list woth all elements
  var candidates = new List();
  var clonedThread = new List();
  for (var i = 0; i < t.les.length; i++) {
    var le = t.les[i];
    var candidate = {
      node:le, 
      index:i, 
      score: 0, 
      selected: false
    }
    clonedThread.push( candidate );
  }



  // Select first and last
  candidates.push( clonedThread.splice( 0, 1 )[0] );
  candidates.push( clonedThread.splice( clonedThread.length-1, 1 )[0] );

  // remove Assesments
  for (var i = 0; i < clonedThread.length; i++) {
    var c = clonedThread[i];
    if( c.le_type == "AS" ){
      clonedThread.splice( i, 1 );
      i--;
    }
  }

  // find IP-connected les, first in sequence
  var maxScore = 0;
  var scores = [];
  for (var i = 0; i < clonedThread.length; i++) {
    var c = clonedThread[i];
    // Score the ones belonging to an IP
    var hasIP = c.node.integrations && c.node.integrations.length > 0 ;
    var previousHasIp = (i == 0) || (i>0 && clonedThread[i-1].node.integrations && clonedThread[i-1].node.integrations.length > 0 )
    var isFirstInSequence = hasIP && !previousHasIp;
    if( isFirstInSequence ){
      c.selected = true;
    }
  }

  for (var i = 0; i < clonedThread.length; i++) {
    var c = clonedThread[i];
    if( c.selected ){
      candidates.push( clonedThread.splice(i,1)[0] );
      i--;
    }
  }

  


  

  // Set max number of LEs
  var elsToPick = clonedThread.length - candidates.length;
  var k = 0.35;
  var maxLEs = Math.floor( k * Math.sqrt( elsToPick) );
   
  var step = Math.floor( clonedThread.length / maxLEs );
  for (var i = 0; i < maxLEs; i++) {
    candidates.push( clonedThread[i*step] );
  };

  // Sort them by index
  candidates.sort(function(a, b){return a.index-b.index});

  var cleanNodes = new List();
  for (var i = 0; i < candidates.length; i++) {
    cleanNodes.push( candidates[i].node );
  };
  t.les = cleanNodes;

}
