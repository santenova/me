var CURRENT_YEAR = 2013; //new Date().getFullYear();

finishLoading = function(){
	//dates
	pool.dates.referenceDates = pool.dates.referenceDates.getWithoutRepetitions();
	pool.dates.referenceDates.removeElement(null);
	pool.dates.referenceDates = pool.dates.referenceDates.getSorted(true);
	pool.dates.globalMinDate = pool.dates.referenceDates.getMin();
	pool.dates.globalMaxDate = pool.dates.referenceDates.getMax();
	pool.dates.globalTimeSpan = pool.dates.globalMaxDate - pool.dates.globalMinDate;


	//build lists of objects from tables
	var i, j, k;
	var object;
	var table;
	var list;

	for(i=0; pool.tables.tablesList[i]!=null; i++){
		table = pool.tables.tablesList[i];

		for(j=0; table[j]!=null; j++){
			if(table[j].name == "id") table[j] = table[j].toStringList();
		}

		list = pool.modelObjects[table.objectsName] = new List();//list of objects
		for(j=0; table[0][j]!=null; j++){
			object = {
				type:toSingular(table.objectsName),
      			typePlural:table.objectsName

			};//creates object
			if(pool.tables.listsByType[object.type]==null) pool.tables.listsByType[object.type]=list;
			list[j] = object;



			for(k=0; table[k]!=null; k++){
				object[table[k].name] = table[k][j];
				if(table[k].name=="image_file_name"){
					//c.log("object.image_file_name: ["+object.image_file_name+"]");
					if(object.image_file_name!=""){
						object.loadImage = function(){
							//c.log("to load image: ["+pool.loading.URL_BASE_IMAGES+this.typePlural+'/'+this.image_file_name+"]");
							Loader.loadImage(pool.loading.URL_BASE_IMAGES+this.typePlural+'/'+this.image_file_name, function(e){
								this.image = e.result;
								this.loadImage=null;
								//c.log('loaded:', this.e);
							}, this);
						}
						//object.loadImage();
					} else {
						object.image_file_name = null;
					}
				}
			}
			if(object.title!=null) object.title = object.title.trim().replace(/\n/g, " ");
			if(object.description!=null) object.description = object.description.trim();
			if(object.type!='le') list[object.id] = object;// the list of objects is also relational, can be used to access objects through the id
			if(pool.centralPointUrls[object.id]!=null) {
				console.log('<><>FOUND:['+object.id+'] -> ['+pool.centralPointUrls[object.id]+']');
				object.rls = true;//pool.centralPointUrls[object.id];
			} else {
				//console.log('……… NOT FOUND:['+object.id+']');
			}
		}
	}


	var ecologies = pool.modelObjects.ecologies;
	var mentalities = pool.modelObjects.mentalities;
	var bifurcations = pool.modelObjects.bifurcations;
	var grades = pool.modelObjects.grades;
	var domains = pool.modelObjects.domains;
	var courses = pool.modelObjects.courses;
	var units = pool.modelObjects.units;
	var les = pool.modelObjects.les;
	var threads = pool.modelObjects.threads;
	var integrations = pool.modelObjects.integrations;
	var standards = pool.modelObjects.standards;
	var outcome_eus = pool.modelObjects.outcome_eus;

	var YEAR_IN_FUTURE = 4050;//2140;


	pool.tables.coursesMatrix = new Table();

	c.log('~~~grades', grades);


	//var ECOLOGY_0_DATE_START = -249000000;

	//add date_finish to grades, ecologies and mentalities (using date_start of next)
	for(i=0; grades[i]!=null; i++){
		if(grades[i].id=="GE"){
			grades.splice(i,1);
			break;
		}
		//grades[i].years_duration = grades[i].date_finish-(i==0?ECOLOGY_0_DATE_START:grades[i].date_start);
		grades[i].years_duration = grades[i].date_finish-grades[i].date_start;
		pool.tables.coursesMatrix[i] = new List();
	}

	for(i=0; ecologies[i]!=null; i++){
		ecologies[i].date_finish = ecologies[i+1]==null?CURRENT_YEAR:ecologies[i+1].date_start;
		c.log('~~~~~~~~~~~~~~~~-----=====>', ecologies[i].title, ecologies[i].date_start, ecologies[i].date_finish);
	}

	//c.log('ecologies[0]', ecologies[0]);

	//ecologies[0].date_start = ECOLOGY_0_DATE_START;

	var mentalitiesDates = new NumberList();

	c.log('mentalities', mentalities);

	for(i=0; mentalities[i]!=null; i++){

		////////EXCEPTION
		// if(i==0) mentalities[i].date_start -= 5000000;
		// if(i==0) mentalities[i].duration += 5000000;


		if(mentalities[i].date_climax==null || isNaN(mentalities[i].date_climax)) mentalities[i].date_climax=(mentalities[i].date_start*0.1+2200*0.9);

		mentalities[i].date_finish =  YEAR_IN_FUTURE + 70*i;// (mentalities[i+1]==null?(mentalities[i].date_climax):mentalities[i+1].date_start);
		//mentalities[i].date_climax = mentalities[i].date_finish;
		mentalitiesDates.push(mentalities[i].date_start);
		mentalitiesDates.push(mentalities[i].date_climax);
		mentalitiesDates.push(mentalities[i].date_finish);
		c.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~-----=====>', mentalities[i].title, mentalities[i].date_start, mentalities[i].date_climax, mentalities[i].date_finish);
	}

	//mentalities table

	mentalitiesDates.push(CURRENT_YEAR);
	mentalitiesDates.push(grades[0].date_start);


	for(i=0; bifurcations[i]!=null; i++){
		mentalitiesDates.push(bifurcations[i].date_intersect);
	}

	mentalitiesDates = mentalitiesDates.getWithoutRepetitions();
	mentalitiesDates = mentalitiesDates.getSorted(true);
	mentalitiesDates = mentalitiesDates.getSubList(0, mentalitiesDates.indexOf(2013));

	pool.tables.mentalitiesDates = mentalitiesDates;

	pool.tables.mentalititesTable = new NumberTable();

	var year;

	for(i=0; mentalitiesDates[i]!=null; i++){
		year = mentalitiesDates[i];
		pool.tables.mentalititesTable[i] = new NumberList();
		pool.tables.mentalititesTable[i].date = year;
		for(j=0; mentalities[j]!=null; j++){
			if(mentalities[j].date_start>year){
				pool.tables.mentalititesTable[i][j] = 0;
			} else if(mentalities[j].date_climax>year){
				pool.tables.mentalititesTable[i][j] = (year-mentalities[j].date_start)/(mentalities[j].date_climax-mentalities[j].date_start);
			} else if(mentalities[j].date_finish>year){
				pool.tables.mentalititesTable[i][j] = 1 - (year-mentalities[j].date_climax)/(mentalities[j].date_finish-mentalities[j].date_climax);
			} else {
				pool.tables.mentalititesTable[i][j] = 0;
			}
		}
	}

	c.log('~~~~ mentalitiesDates', mentalitiesDates);

	//pool.tables.mentalititesTable.push(ListGenerators.createListWithSameElement(pool.tables.mentalititesTable[0].length, 1));



	pool.tables.bifurcationIndexes = [];
	for(i=0; bifurcations[i]!=null; i++){
		pool.tables.bifurcationIndexes[i] = mentalitiesDates.indexOf(bifurcations[i].date_intersect);
	}

	var table2 = pool.tables.mentalititesTable;

	table2 = table2.getTransposed();


	pool.tables.mentalitiesFlowIntervals = IntervalTableOperators.scaleIntervals(NumberTableFlowOperators.getFlowTableIntervals(table2, false, false, true), 0.98);

	pool.tables.mentalitiesFlowIntervals.colors = ColorListGenerators.createCategoricalColors(0, pool.tables.mentalitiesFlowIntervals.length, ColorScales.antiSolar);

	//pool.tables.mentalitiesFlowIntervals.print();


	//build colors for domains
	var rgb;
	for(i=0; domains[i]!=null; i++){
		domains[i].colorTransparent = getColorFromString(domains[i].color, 0.3);
		domains[i].color = getColorFromString(domains[i].color);
		domains[i].rgb = ColorOperators.colorStringToRGB(domains[i].color);
		domains[i].rgbTransparent = ColorOperators.colorStringToRGB(domains[i].color);
		domains[i].les = new List();
	}


	// Move WL subdomains to the end of the domains list
	// This is a fix to enable the spiral to draw subdomains easier
	sortDomains();
	//fusionAndRemoveSubDomains();




	for(i=0; domains[i]!=null; i++){
		c.l('•••••••••••••', domains[i].id, domains[i].title);
	}

	//creating connections from ids, and building courses matrix
	var course;

	var iG;
	var iD;

	for(i=0; courses[i]!=null; i++){
		course = courses[i];
		course.grade = grades[course.id_grade];

		if(course.grade!=null){
			if(course.grade.courses==null) course.grade.courses = new List();
			course.grade.courses.push(course);
		}
		course.domain = domains[course.id_domain];
		//c.l('%%%%%%%%%%% course.id_domain, domains[course.id_domain], domains[course.id_domain].id', course.id_domain, domains[course.id_domain], domains[course.id_domain].id)
		if(course.domain!=null){
			if(course.domain.courses==null) course.domain.courses=new List();
			course.domain.courses.push(course);
		}

		course.units = getObjectsFromIdsString(units, course.list_of_units_ids);

		for(j=0; course.units[j]!=null; j++){
			course.units[j].course = course;
			course.units[j].domain = course.domain;
			course.units[j].grade = course.grade;
		}

		iG = grades.indexOf(course.grade);
		iD = domains.indexOf(course.domain);

		if(course.grade!=null && course.domain!=null && iG!=-1  && iD!=-1 && pool.tables.coursesMatrix[iG][iD]==null){
			//c.l('%%%% iG, iD, course.id', iG, iD, course.id);
			pool.tables.coursesMatrix[iG][iD] = course;
		} else {
			// c.l('%%% WRONG');
			// c.l("% iG, iD, course.grade==null, course.domain==null", iG, iD, course.grade==null, course.domain==null);

			// c.l('domains.length', domains.length);
			// c.l(domains);
		}

		course.unitsDuration = 0;
	}

	var message = "LEs under more than one unit:";
	for(i=0; units[i]!=null; i++){
		units[i].les = getObjectsFromIdsString(les, units[i].list_of_LE_ids);

		for(j=0; units[i].les[j]!=null; j++){
			if(units[i].les[j].unit!=null)  message+='\n le: '+units[i].les[j].id+' under units: '+units[i].les[j].unit.id+' and '+units[i].id;
			units[i].les[j].unit = units[i];
			units[i].les[j].course = units[i].course;
			units[i].les[j].domain = units[i].domain;
			units[i].les[j].grade = units[i].grade;
			//c.log(i, j, units[i].les[j].id, units[i].les[j].title);
		}
		units[i].duration = Math.max(Number(units[i].duration), 1); // by default minimal duration in units will be 1 week
		if(units[i].course!=null) units[i].course.unitsDuration+=units[i].duration;

	}
	c.log(message);

	//
	message = "LEs without units:\n\n";
	for(i=0; les[i]!=null; i++){
		//c.log(i, les[i].id, les[i].title);
		les[i].visible = true;
		les[i].domains = getObjectsFromIdsString(domains, les[i].list_of_domain_ids);

		if(les[i].unit!=null && les[i].unit.course!=null){
			les[i].domains.push(les[i].unit.course.domain);
			les[i].domains = les[i].domains.getWithoutRepetitions();
		}

		les[i].standards = getObjectsFromIdsString(standards, les[i].list_of_standard_ids);
		les[i].outcome_eus = getObjectsFromIdsString(outcome_eus, les[i].list_of_outcome_eu_ids);
		//les[i].les = getObjectsFromIdsString(domains, les[i].list_of_domain_ids);

		if(les[i].unit==null) message+='\n'+les[i].id;

		if(les[i].domain!=null) les[i].domain.les.push(les[i]);

		les[i].color = (les[i].domain==null||!pool.viewParams.COLORED_LES)?'black':les[i].domain.color;

		if(les[i].unit!=null && les[i].rls!=null) les[i].unit.rls = true;//RLS
	}



	for(i=0; integrations[i]!=null; i++){
		// Assign LEs to integrations
		integrations[i].les = getObjectsFromIdsString(les, integrations[i].list_of_LE_ids);
		// for each Integration, iterate its LEs
		for(j=0; integrations[i].les[j]!=null; j++){
			// Let the LE know that it belongs to this Integration
			if(integrations[i].les[j].integrations==null) integrations[i].les[j].integrations=new List();
			integrations[i].les[j].integrations.push(integrations[i]);
			// Collect domains from LE and assign to Integration
			if(integrations[i].domains==null) integrations[i].domains=new List();
			if(integrations[i].domains.indexOf(integrations[i].les[j].domain)==-1) integrations[i].domains.push(integrations[i].les[j].domain);
			if(integrations[i].les[j].domains!=null && integrations[i].les[j].domains.length>0) integrations[i].domains = integrations[i].domains.concat(integrations[i].les[j].domains);
			if(integrations[i].les[j].integrations==null) integrations[i].les[j].integrations=new List();
			integrations[i].les[j].integrations.push(integrations[i]);
		}

		if(integrations[i].domains!=null) integrations[i].domains = integrations[i].domains.getWithoutRepetitions();

		// But for the same reason, IP now need domain, grade, course and unit, just as any other LE
		var ipUnit = getObjectById( "u_" + integrations[i].unit_id );
		integrations[i].unit = ipUnit;
		integrations[i].course = ipUnit.course;
		integrations[i].domain = ipUnit.domain;
		integrations[i].grade = ipUnit.grade;

		if(integrations[i].unit!=null && integrations[i].rls!=null) integrations[i].unit.rls = true;//RLS
	}

	for(i=0; units[i]!=null; i++){
		units[i].color = units[i].rls == null?units[i].domain.colorTransparent:ColorOperators.addAlpha(ColorOperators.interpolateColors(units[i].domain.colorTransparent, 'black', 0.2), 0.5);
	}


	for(i=0; threads[i]!=null; i++){
		threads[i].les = getObjectsFromIdsString(les, threads[i].list_of_LE_ids);
		//threads[i].ips = getObjectsFromIdsString(integrations, threads[i].list_of_LE_ids, "i");
		// Prune thread so that it is not so long
		//pruneThread(threads[i]);
		for(j=0; threads[i].les[j]!=null; j++){
			if(threads[i].les[j].threads==null) threads[i].les[j].threads = new List();
			threads[i].les[j].threads.push(threads[i]);
		}

		threads[i].color = 'black';//getColorFromString(threads[i].color);
	}

	//sort threads
	var prev_view_mode = pool.viewParams.VIEW_MODE;
	pool.viewParams.VIEW_MODE = 0;
	pool.ui.slider = new TimeSlider();
	pool.frames.tlProjectionFrame = new Rectangle();
	resizeWindow();
	pool.ui.slider.draw();
	pool.frames.tlProjectionFrame.width = pool.frames.tlFrame.width/pool.ui.slider.amp;
	pool.frames.tlProjectionFrame.x = pool.frames.tlFrame.x - pool.frames.tlProjectionFrame.width*pool.ui.slider.x0;

	drawUnits();
	pool.viewParams.VIEW_MODE = prev_view_mode;


	sortLEsByTree( pool.modelObjects.les, "global" );
	for(i=0; pool.modelObjects.units[i]!=null; i++){
		sortLEsByTree( pool.modelObjects.units[i].les, "unit "+pool.modelObjects.units[i].title );
	}



	// for(i=0; pool.modelObjects.courses[i]!=null; i++){
	// 	pool.modelObjects.courses[i].units.sort( dynamicSort( "order") )
	// }

	//reorderLesInThreads();
	endProcess();
	for(i=0; threads[i]!=null; i++){
		//sortLEsByTree( threads[i].les, "thread "+threads[i].title );
		threads[i].les = threads[i].les.getSortedByProperty('angle', true);

	}
}

// Clean-up functions
fusionAndRemoveSubDomains = function()
{

	pool.modelObjects.domains[pool.modelObjects.domains[2].id] = pool.modelObjects.domains["d_2"];
	pool.modelObjects.domains[pool.modelObjects.domains[3].id] = pool.modelObjects.domains["d_2"];
	pool.modelObjects.domains[pool.modelObjects.domains[4].id] = pool.modelObjects.domains["d_2"];

	pool.modelObjects.domains.splice(2, 1);
	pool.modelObjects.domains.splice(2, 1);
	pool.modelObjects.domains.splice(2, 1);
}

sortDomains = function(){
	// Move the WL subdomains down (assuming the first one is English, with id d_10, and the other two are the next ones in the list)
	// As long as this doesn't change, it will work
	var itemIndex = pool.modelObjects.domains.indexOf( getObjectById( "d_2" ) )
	var subdomains = pool.modelObjects.domains.splice( itemIndex, 4);
	pool.modelObjects.domains.push( subdomains[0], subdomains[1], subdomains[2], subdomains[3]);

	pool.modelObjects.domains["d_10"].domain = pool.modelObjects.domains["d_2"];
	pool.modelObjects.domains["d_11"].domain = pool.modelObjects.domains["d_2"];
	pool.modelObjects.domains["d_12"].domain = pool.modelObjects.domains["d_2"];
}


//utils

getObjectById = function(id){

	//if(id=="d_10" || id=="d_11" || id=="d_12") id="d_2"; // <----- Fusion of WL domain and subdomains

	//c.log('getObjectById');
	if(id==String(Number(id))) return pool.modelObjects.les.getFirstElementByPropertyValue('id', id);



	for(list in pool.modelObjects){
		try{
			if(pool.modelObjects[list][id]!=null) return pool.modelObjects[list][id];
		} catch(err){
			// c.log('    id: ['+id+']');
			// c.log('    list: ['+list+']');
			// c.log('    pool.modelObjects[list]', pool.modelObjects[list]);
		}
	}
	return null;
}


//utilitary


sortLEsInThread = function(le0, le1){
	return le0.x<le1.x?1:-1;

	if(le0.grade==null || le0.unit==null) return -1;
	if(le1.grade==null || le1.unit==null) return 1;

	if(le0.grade.id<le1.grade.id){
		return -1;
	} else if(le0.grade.id>le1.grade.id){
		return 1;
	}

	if(le0.grade.units==null) return -1;
	if(le1.grade.units==null) return 1;

	if(le0.grade.units.indexOf(le0.unit)<le1.grade.units.indexOf(le1.unit)){
		return -1;
	} else if(le0.grade.units.indexOf(le0.unit)>le1.grade.units.indexOf(le1.unit)){
		return 1;
	}



	if(le0.unit.les.indexOf(le0)<le1.unit.les.indexOf(le1)){
		return -1;
	} else if(le0.unit.les.indexOf(le0)>le1.unit.les.indexOf(le1)){
		return 1;
	}

	return -1;
}

getColorFromString = function(string, alpha){

	string = string.replace(/\n/g,"");
	string = string.replace(/\r/g,"");

	var rgb = string.split('.');//[255, 0, 0]// string.split('.');
	if(alpha==null) return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
	return 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+alpha+')';
}

getObjectsFromIdsString = function(objectsList, idsString){
	if(idsString==null || idsString=="") return new List();

	var i;
	var ids = String(idsString).replace(/\./, "|").replace(/\s/g, "").split("|");
	//c.l('idsString: ['+idsString+'], ids:', ids);
	var list = new List();
	var object;
	//c.log('['+idsString+']          |'+ids.join('|')+'|');
	for(i=0; ids[i]!=null; i++){
		object = getObjectById(ids[i]);
		if( !object ){
			object = getObjectById( "i_"+ids[i]);
		}
		if(ids[i]!="" && object!=null) list.push(object);
	}

	//c.l('idsString: ['+idsString+'], ids:', ids);

	return list;
}

fixDates = function(table){
	var i, j;
	for(i=0; table[i]!=null; i++){
		if(table[i].name == "date_start" || table[i].name == "date_finish"  || table[i].name == "date_climax"  || table[i].name == "date_intersect"){
			for(j=0; table[i][j]!=null; j++){
				table[i][j] = String(table[i][j]).replace(/,/g, "").replace(/\s/g, "").toLowerCase();
				if(table[i][j]=="present"){
					table[i][j] = CURRENT_YEAR;
				} else if(table[i][j]==""){
					table[i][j] = null;
				} else if(table[i][j].indexOf('bce')!=-1){
					table[i][j] = -Number(table[i][j].replace('bce', ''));
				} else {
					table[i][j] = Number(table[i][j].replace('ce', ''));
				}
			}
			pool.dates.referenceDates = pool.dates.referenceDates.concat(table[i]);
		}
	}
}

fixListsNames = function(table){
	var i;

	for(i=0; table[i]!=null; i++){
		table[i].name = table[i].name.replace(/\s/g, "_").replace("*", "");
	}
}

removeNOTESColumn = function(table){
	var i;

	for(i=0; table[i]!=null; i++){
		if(table[i].name == "NOTES"){
			table.removeElementAtIndex(i);
			return;
		}
	}
}

toSingular = function(name){
	name = name.substr(name.length-3)=='ies'?
		name.substr(0, name.length-3)+'y'
		:
		name.charAt(name.length-1)=='s'?name.substr(0, name.length-1):name;
	return name;
}
