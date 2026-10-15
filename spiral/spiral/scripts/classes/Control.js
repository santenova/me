allLoaded = function(){
	console.log( "* * * * * All Loaded * * * * * *")
	initializeAngularApp();
}

selectObject = function(object){
	c.log("[C] selectObject --->>", object);

	pool.objectsInteraction.selectedObject = object;
	if(object.loadImage) object.loadImage();

	selectObjectSE(object);
	



	jumpToObject( object ); //dani --> you should call a bridge function here, probably called selectObjectPANEL
	
}

selectObjectById = function(id){
	console.log( "#### selectObjectById(): " + id );
	var node = getObjectById( id );
	if( node )
	{
		selectObject(node);
	}else{
		alert( "Error selecting by id: " + id );
	}
}

unSelectObject = function(){
	c.l('[C] unSelectObject, pool.objectsInteraction.selectedObject:', pool.objectsInteraction.selectedObject);

	pool.objectsInteraction.selectedObject = null;
	
	unSelectObjectSE();
	jumpToObject( );
}


overObject = function(object, hideTooltip){
	if(object==null) return;

	pool.objectsInteraction.overObjectOnFrame = object;
	if(pool.objectsInteraction.overObject == object) return;

	c.log('[C] overObject.id --->>', object.id);

	pool.objectsInteraction.overObject = object;
	
	overObjectSE(object);
	overObjectPanel( object, hideTooltip )
	
	
}

unOverObject = function(){
	if(pool.objectsInteraction.overObject == null) return;
	
	c.log('[C] unOverObject --->>');

	pool.objectsInteraction.overObject = null;
	
	unOverObjectSE();
	unOverObjectPanel();
}