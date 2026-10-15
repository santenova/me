function analyzeCookie()
{
	if(typeof(Storage)!=="undefined")
	{
		if( localStorage.RULER_STATE )
			pool.viewParams.RULER_STATE = localStorage.RULER_STATE;
		if( localStorage.PANEL_OPEN )
			pool.viewParams.PANEL_OPEN = JSON.parse( localStorage.PANEL_OPEN ) // Using JSON.parse() to convert from string to real Boolean;
		if( localStorage.OPEN_COUNT )
			pool.viewParams.OPEN_COUNT = localStorage.OPEN_COUNT;
		if( localStorage.LAST_OPEN_DATE )
			pool.viewParams.LAST_OPEN_DATE = localStorage.LAST_OPEN_DATE;
		console.log( "-- read localStorage: ", localStorage );
		console.log( "-- pool.viewParams: ", pool.viewParams );
	}
	else
	{
		console.info("localStorage not supported, COULDN'T READ");
	}
}

function writeCookie()
{
	if(typeof(Storage)!=="undefined")
	{
		try{
			localStorage.RULER_STATE = pool.viewParams.RULER_STATE;
			localStorage.PANEL_OPEN = pool.viewParams.PANEL_OPEN;
			localStorage.OPEN_COUNT = pool.viewParams.OPEN_COUNT;
			localStorage.LAST_OPEN_DATE = pool.viewParams.LAST_OPEN_DATE;
			console.log( "write localStorage: ", localStorage );
		}catch( err){
			console.warn( "unable to save in localstorage: ", err );
		}
	}
	else
	{
		console.info("localStorage not supported, COULDN'T WRITE");
	}
}
