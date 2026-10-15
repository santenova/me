initLoading = function(){
	//Loader.loadData(pool.loading.URL_PANELS_TABLE, onLoadPanelsTable, this);
	onLoadPanelsTable( { result:'' } );
	Loader.loadImage(pool.loading.URL_MINI_SPIRAL_IMAGE, onLoadImage, this);
}

onLoadPanelsTable  = function(e){
	var table = TableEncodings.CSVtoTable(e.result, true);

	pool.tables.panelsTable = table;

	//loadDataTables();
	loadCentralPointIndex();
}

function loadCentralPointIndex(){
	Loader.loadData(pool.loading.URL_CENTRAL_POINT_INDEX, onLoadCentralPointIndex, this);
}


onLoadCentralPointIndex  = function(e){
	var idsMap = {};

	var rows = e.result.split("\n");
	var row;
	console.log( "CentralPointIdMapping LENGTH: " + rows.length );
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i].split(",");
		var localId = row[0].split("/")[1];
		var remoteId = row[1];
		//console.log( "CentralPointIdMapping: " + localId + " --- " + remoteId );
		if( remoteId != "" ){
			idsMap[localId] = remoteId;
			console.log('<><> localId:['+localId+']');
		}
	}

	pool.centralPointUrls = idsMap;

	loadDataTables();
}

loadDataTables = function(){
	var filesNames = pool.loading.filesNames;
	var i;
	for(i=0; filesNames[i]!=null; i++){
		var fullFilePath;
		switch( pool.loading.API_MODE){
			case "local_dynamic":
				fullFilePath = pool.loading.URL_BASE_LOCAL_DYNAMIC+filesNames[i];
				break;

			case "local":
				fullFilePath = pool.loading.URL_BASE_LOCAL+filesNames[i]+'.csv';
				break;

			case "production":
				fullFilePath = pool.loading.URL_BASE_PRODUCTION+filesNames[i]+".csv";
				break;

			default:
				console.error( "Unrecongised API MODE: ", pool.loading.api_mode );
				break;
		}
		console.log( "Will load data file: ", fullFilePath );
		Loader.loadData( fullFilePath, onLoadTable, this, filesNames[i]);
	}
}

onLoadTable = function(e){
	var table = TableEncodings.CSVtoTable(e.result, true);

	table.objectsName = e.param;
	table.name = table.objectsName+'Table';

	removeNOTESColumn(table);
	fixListsNames(table);
	fixDates(table);

	pool.tables[table.name] = table;

	pool.tables.tablesList.push(table);

	pool.loading.nLoaded++;
	if(pool.loading.filesNames.length==pool.loading.nLoaded){
		pool.loading.loadingData = false;

		if(pool.viewParams.ADDING_FAKE_ELEMENTS) addFakeElements();
		generateUniqueIds();
		finishLoading();
	}

	enterFrame();
}

generateUniqueIds = function()
{
	var rules = [
					{
						tableName: "bifurcations",
						fields:[
							{ name: "prev_mentality_id", prefix: "m", isList: false },
							{ name: "next_mentality_id", prefix: "m", isList: false }
						]
					},
					{
						tableName: "grades",
						fields:[
							{ name: "associated_ecology", prefix: "e", isList: true },
							{ name: "associated_mentality", prefix: "m", isList: true }
						]
					},
					{
						tableName: "courses",
						fields:[
							{ name: "id_domain", prefix: "d", isList: false },
							{ name: "id_grade", prefix: "g", isList: true }
							 , { name: "list_of_units_ids", prefix: "u", isList: true }
						]
					},
					{
						tableName: "units",
						fields:[
							{ name: "course_id", prefix: "c", isList: false }
						]
					},
					{
						tableName: "les",
						fields:[
							{ name: "list_of_domain_ids", prefix: "d", isList: true }
						]
					}
				];
	var tableNames = pool.loading.filesNames;
	for (var i = 0; i < tableNames.length; i++) {
		var tableName = tableNames[i];
		console.log( "tableName: ", tableName );
		var compoundTableName = tableNames[i] + "Table";
		var tablePrefix = tableName.substr( 0, 1 );
		var table = pool.tables[compoundTableName];


		// Clean html from titles and descriptions
		var titles = table.getFirstElementByName( "title" );
		var descriptions = table.getFirstElementByName( "description" );

		if( titles )
		{
			// Create new fileds to keep HTML-enabled fields
			var titlesWithHtml = new StringList();
			titlesWithHtml.name = "titleHtml";
			table.push( titlesWithHtml )

			var descriptionsWithHtml = new StringList();
			descriptionsWithHtml.name = "descriptionHtml";
			table.push( descriptionsWithHtml )

			//}

			for( var j=0; j<titles.length; j++ ){
				// Clean HTML tags (just leave bold and italics)
				titlesWithHtml[j] = titles[j].replace(/<(?!\s*\/?(b|em|i)\b)[^>]+>/ig,"");;
				descriptionsWithHtml[j] = descriptions[j].replace(/<(?!\s*\/?(b|em|i)\b)[^>]+>/ig,"");;
				// store pure text (no html) in main fields
				titles[j] = $( "<div>" + titles[j] + "</div>").text();
				descriptions[j] = $( "<div>" + descriptions[j] + "</div>").text();
			}
		}
		// If LEs table, no need to regenerate ID
		if( tableName == "les" )
			continue;

		// Process IDs
		tableName = compoundTableName;
		//console.log( "--> generateUniqueIds: " + tableName );
		// Change ids in current table
		for( var j=0; j<table[0].length; j++ ){
			table[0][j] = tablePrefix + "_" + table[0][j];
		}
	};

	for (var i = 0; i < rules.length; i++) {
		var rule = rules[i];
		var tableName = rules[i].tableName + "Table";
		var table = pool.tables[tableName];
		for( var j=0; j<rule.fields.length; j++ ){
			var fieldName = rule.fields[j].name;
			var fieldPrefix = rule.fields[j].prefix;
			var isList = rule.fields[j].isList;
			var column = table.getFirstElementByName( fieldName );
			//var columnIndex = table.indexOf( column );
			//console.log( "will parse column " + fieldName, column );
			for( var k=0; k<column.length; k++ ){
				var currentValue = column[k];
				var newValue;
				if( currentValue == "" || currentValue == undefined || currentValue == null )
				{
					newValue = column[k];
				}
				else if( isList ){
					try{
						newValue = String( currentValue ).replace(/\./g, "|");
						newValue = String(newValue).split("|");
						newValue = StringList.fromArray( newValue ).append( fieldPrefix+"_", false );
						newValue = newValue.join("|");
					}catch(e)
					{
						console.log( "error parsing relational list");
					}
				}else{
					newValue = fieldPrefix + "_" + currentValue;
				}

				column[k] = newValue;
			}
			//var newColumn = StringList.fromArray( string.split(",") ).append( fieldPrefix, false );
			//newColumn = newColumn.join(",");
			//table[columnIndex] = newColumn;
		}
	};

	// Update subdomains titles to include parent domains ones
	var domains = pool.tables.domainsTable;
	var titles = domains.getFirstElementByName("title");
	var parent_ids = domains.getFirstElementByName("parent_id");

	for (var i = 0; i < titles.length; i++) {
		// If they are subdomains, we assume they belong to WLL, since it's the only domain with subdomains
		// To-do: maybe un-hardocde this? doesn't look worth it ATM
		if( parent_ids[i] ){
			titles[i] = "World Languages and Literature: " + titles[i];
		}
	};

}

addFakeElements = function(){
	var i;
	var N_NEW_LES = 1500;
	var id;
	var units = pool.tables.unitsTable;
	var nUnit;

	var les = pool.tables.lesTable;

	idsDomains = ["CH", "WL", "SC", "MA", "MS", "VA", "PA", "WE"];

	var doms;
	/*
	0: "id"
	1: "FC#"
	2: "HM Domain"
	3: "title"
	4: "description"
	5: "date start"
	6: "date finish"
	7: "list of domain_ids"
	8: "list of standard ids"
	9: "list of outcome_EU ids"
	10: "image file name*"
	 */


	for(i=0; i<N_NEW_LES; i++){
		id = '10000000'+i;
		les[0].push(id);
		les[1].push("");
		les[2].push("");
		les[3].push(id);
		les[4].push(id+": The Spiral provides a cohesive architecture for analysis of the past as a dynamical system and enables students to more fully understand the present while envisioning the future.");
		les[5].push("");
		les[6].push("");

		doms = [];

		idsDomains.forEach(function(dom){
			if(Math.random()<0.4) doms.push(dom);
		});

		les[7].push(doms.join(','));

		les[8].push("");
		les[9].push("");
		les[10].push("");

		nUnit = Math.floor(units[0].length*Math.random());

		//c.log('1', units[6][nUnit]);

		units[6][nUnit] = units[6][nUnit]==""?id:(units[6][nUnit]+","+id);

		//c.log('2', units[6][nUnit]);

	}


}

onLoadImage = function(e){
	switch(e.url){
		case pool.loading.URL_MINI_SPIRAL_IMAGE:
			pool.loading.minSpiralImage = e.result;
			break;
	}
}
