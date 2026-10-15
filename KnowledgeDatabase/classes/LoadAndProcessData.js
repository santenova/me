/**
	'./resources/php/delimoebio.php&v=10'
	santiago ortiz: no?
	Daniel Aguilar: sí
	santiago ortiz: y esa variable v dentro del php se lee $v
	santiago ortiz: no?
	Daniel Aguilar: y en el lado del php,:
	$miVar = $_GET["v"] 
 */

onLoadCenters = function(e){
	//Loader.loadData('./resources/php/delimoebio.php', onLoadPhp, this);
	
	var xCoordinates = StringOperators.getAllTextsBetweenStrings(e.result, "cx=\"", "\"").toNumberList();
	var yCoordinates = StringOperators.getAllTextsBetweenStrings(e.result, "cy=\"", "\"").toNumberList();
	loadedCenters = GeometryConvertions.twoNumberListsToPolygon(xCoordinates, yCoordinates).factor(10);
	
	c.log("loadedCenters.length", loadedCenters.length);
	
	Loader.loadData(URL_PIECES, onLoadPaths, this);
	Loader.loadData(URL_SETS, onLoadPaths, this);
}

// onLoadPhp = function(e){
	// c.log('***');
	// c.log(e);
// }

onLoadPaths = function(e){
	var polygons = e.url==URL_PIECES?piecesBases:sets;
	var paths = StringOperators.getAllTextsBetweenStrings(e.result, "<path", ">").getSurrounded("<path", ">");
	
	var iPath = 0;
	
	for(var i=0; i<paths.length; i++){
		polygons.push(SVGdecode.pathToBezierPolygon(paths[i]));
	}
	
	if(piecesBases.length>0 && sets.length>0){
		var inSet;
		var rgb;
		var setRgb;
		var nSets;
		var binNumber;
		var binNumbers = new NumberList();
		
		var piece;
		var pieceBase;
		var pieceBase10;
		var colorList;
		
		var angle;
		
		piecesColors = new ColorList();
		piecesColorsRGB = new List();
		
		colorTable = new Table();
		
		pieces[0]=piecesBases[0];
		centers[0] = new Point(0,0);
		
		colorTable.push(setsColors.clone());
		piecesColors.push(ColorOperators.RGBtoHEX(123,123,123));
		piecesColorsRGB.push([255,255,255]);
		binNumbers.push(Math.pow(2,7)-1);
				
		for(var i=1; piecesBases[i]!=null; i++){
			pieceBase = piecesBases[i];
			pieceBase10 = pieceBase.factor(10);
			
			for(var k=0;loadedCenters[k]!=null;k++){
				if(PolygonOperators.bezierPolygonContainsPoint(pieceBase10, loadedCenters[k])){
					centerBase = loadedCenters[k].factor(0.1);
					break;
				}
			}
			for(var j=0; j<7; j++){
				angle = j*TwoPi/7;
				
				piece = j==0?pieceBase:pieceBase.getRotated(angle);
				centerPiece = j==0?centerBase:centerBase.getRotated(angle);
				
				centers.push(centerPiece);
				
				pieces.push(piece);
				
				binNumber=0;
				
				rgb = [0,0,0];
				
				colorList = new ColorList();
				colorTable.push(colorList);
				
				nSets = 0;
				
				for(var k=0; sets[k]!=null; k++){
					inSet = PolygonOperators.polygonContainsPoint(sets[k], centerPiece);
					binNumber += inSet?Math.pow(2, k):0;
					if(inSet){
						nSets++;
						setRgb = setsColorsRGB[k];
						rgb[0]+=setRgb[0];
						rgb[1]+=setRgb[1];
						rgb[2]+=setRgb[2];
						
						colorList.push(ColorOperators.RGBtoHEX(setRgb[0], setRgb[1], setRgb[2]));
					}
				}
				
				binNumbers.push(binNumber);
				
				switch(COLOR_ADDITION_MODE){
					case 0:
						rgb[0]/=nSets*configuration.opaquePieces;
						rgb[1]/=nSets*configuration.opaquePieces;
						rgb[2]/=nSets*configuration.opaquePieces;
						break;
					case 1:
						rgb[0] = Math.min(rgb[0], 255);
						rgb[1] = Math.min(rgb[1], 255);
						rgb[2] = Math.min(rgb[2], 255);
						break;
				}
				
				piecesColors.push(ColorOperators.RGBtoHEX(Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])));
				piecesColorsRGB.push(rgb);	
			}
		}
		
		pieceBase = pieceBase;
		
		if(configuration.delicious){
			var multiLoader = new MultiLoader();
			multiLoader.loadImages(iconsNamesExtended.replace(/!/g, "star").getSurrounded('./resources/icons/', '.png'), onLoadIcons);
		}
		
		pieces = ListOperators.sortListByNumberList(pieces, binNumbers, false);
		piecesColors = ListOperators.sortListByNumberList(piecesColors, binNumbers, false);
		piecesColorsRGB = ListOperators.sortListByNumberList(piecesColorsRGB, binNumbers, false);
		colorTable = ListOperators.sortListByNumberList(colorTable, binNumbers, false);
		centers = ListOperators.sortListByNumberList(centers, binNumbers, false);
		
		binNumbers = ListOperators.sortListByNumberList(binNumbers, binNumbers, false);
		
		
		if(configuration.colornames) ColorNames.load();
		
	}
	resizeWindow();
}

colorsLoaded = function(){
	piecesColorReferences = ColorNames.getNamesAndColorsFromColorList(piecesColors);
	setsColorReferences = ColorNames.getNamesAndColorsFromColorList(setsColors);
}


//////////////////////////////////////

onLoadData = function(e){
	delicious_data =  JSON.parse(e.result);
	points = new Polygon();
	
	var tags;
	var iconsTagsNames;
	
	var linkObject;
	
	nLinksInPieces = NumberListGenerators.createSortedNumberList(Math.pow(2,7)-1,0,0);
	
	var array = delicious_data.array;
	
	for(var i=0; array[i]!=null; i++){
		linkObject = array[i];
		
		//points
		points[i] = new Point(linkObject.x, linkObject.y);
		tags = linkObject.tags;
		
		linkObject.tagsString = tags.join(" ").toLowerCase().replace(/\[\w+\]/g, "");
		
		//images
		for(var j=iconsTags.length-1; iconsTags[j]!=null; j--){
			if(tags.indexOf(iconsTags[j])!=-1){
				linkObject.image = iconsImages[j];
				break;
			}
		}
		
		linkObject.icons = new NumberList();
		for(j=0; iconsTagsExtended[j]!=null; j++){
			linkObject.icons[j]=Number(tags.indexOf(iconsTagsExtended[j])!=-1);
		}
		
		linkObject.date = new Date(Date.parse(linkObject.date));
		
		if(tags.indexOf('!!!')!=-1){
			linkObject.stars = 3;
		} else if(tags.indexOf('!!')!=-1){
			linkObject.stars = 2;
		} else if(tags.indexOf('!')!=-1){
			linkObject.stars = 1;
		} else {
			linkObject.stars = 0;
		}
		
		linkObject.active = true;
		linkObject.powers = NumberOperators.powersOfTwoDecomposition(linkObject.binNumber);
		for(j=linkObject.powers.length; j<7; j++){
			linkObject.powers[j]=0;
		}
		
		nLinksInPieces[delicious_data.array[i].binNumber-1]++;
	}
	
	nActive = i1 = nLinks = delicious_data.array.length;
	
	loadingData = false;
	texts.dataLoaded();
	
	resizeWindow();
	
	timeLine.setData(delicious_data);
	
	
	if(hashTagBlocks!=null){
		for(i=0; hashTagBlocks[i]!=null; i++){
			switch(hashTagBlocks[i].charAt(0)){
				case '(':
					var values = hashTagBlocks[i].substr(1, hashTagBlocks[i].length-2).split(',');
					timeLine.setValues(Number('0.'+values[0]), values[1]=='100'?1:Number('0.'+values[1]));
					break;
				case 'c':
					actives = NumberOperators.powersOfTwoDecomposition(Number(hashTagBlocks[i].substr(2)), actives.length);
					break;
				case 'i':
					iconsActives = NumberOperators.powersOfTwoDecomposition(Number(hashTagBlocks[i].substr(2)), iconsActives.length);
					break;
				case 's':
					textFilter.setText(hashTagBlocks[i].substr(2));
					break;
				case 'f':
					configuration.filterType = hashTagBlocks[i].substr(2)=="AND"?1:2;
					break;
				case 'F':
					configuration.filterIconsType = hashTagBlocks[i].substr(2)=="AND"?1:2;
					break;
			}
		}
	}
	
	setsFilter.setFilterType();
	categoryTags.setFilterType();
	
	combineFilters();
}

onLoadDeliciousDataXML = function(e){
	//c.log(e);
	
	var DELICIOUS_DATA_OBJECT = new Object();
	DELICIOUS_DATA_OBJECT.array = new Array();
	
	var posts = StringOperators.getAllTextsBetweenStrings(e.result, "<post description=\"", "/>");
	
	c.log('posts.length', posts.length);
	
	var title;
	var description;
	var tagsString;
	var tags;
	var link;
	var date;
	var dna;
	var i;
	var j;
	
	var sums = new NumberList();
	for(j=0; sevenBases[j]!=null; j++){
		sums[j]=0;
	}
	
	var binaryNumbers = new NumberList();
	var nBinary = Math.pow(2, sevenBases.length);
	
	c.log("nBinary", nBinary);
	
	for(i=0; i<nBinary; i++){
		binaryNumbers[i]=0;
	}
	
	var binNumber;
	var active;
	
	for(i=0; posts[i]!=null; i++){
		title = posts[i].substr(0, posts[i].indexOf("\""));
		description = StringOperators.getFirstTextBetweenStrings(posts[i], 'extended=\"', '"');
		description = description=="\" hash="?"":description.replace(/\"/g, "'");
		tagsString = StringOperators.getFirstTextBetweenStrings(posts[i], 'tag=\"', '"');
		
		tagsString = tagsString.replace(/\[video_nova\]|\[video_youtube\]|\[video_ted\]/g, "[video]").replace(/\[meta_compilation\]/g, "[compilation]").replace(/\[image_flickr\]|\[image_svg\]|\[big_image\]/g, "[image]").replace(/\[google_book\]/g, "[book]");
		
		tags = tagsString.split(' ');
		link = StringOperators.getFirstTextBetweenStrings(posts[i], 'href=\"', '"');
		date = new Date(Date.parse(StringOperators.getFirstTextBetweenStrings(posts[i], 'time=\"', '"')));
		
		dna="";
		binNumber=0;
		
		tagsString = " "+tagsString+" ";
		
		for(j=0; sevenBases[j]!=null; j++){
			active = tagsString.search(sevenBases[j])!=-1;// && (requireFilter.indexOf(j)==-1 || tagsString.search("!")!=-1);
			dna+=active?"X":" ";
			if(active) sums[j]++;
			binNumber += active?Math.pow(2, j):0;
		}
		//c.log(dna, binNumber);
		binaryNumbers[binNumber]++;
		
		DELICIOUS_DATA_OBJECT.array[i] = {
			'title':title,
			'description':description,
			'tags':tags,
			'link':link,
			'date':date,
			'binNumber':binNumber
		}
		
		if(link.indexOf('http://webhelp.esri.com')!=-1){
			c.log('//////////////////////////////////////////');
			c.log('title', title);
			c.log('tagsString ['+tagsString+']');
			c.log('tagsString.length', tagsString.length);
			c.log('binNumber', binNumber);
			for(j=0; sevenBases[j]!=null; j++){
				c.log('\n   j, sevenBases[j]', j, sevenBases[j]);
				c.log('    categories[j]', categories[j]);
				active = tagsString.search(sevenBases[j])!=-1;
				c.log('   active', active);
			}
			c.log('//////////////////////////////////////////');
		}
		
	}
	
	weights = binaryNumbers.clone();
	
	c.log("sums", sums);
	c.log("binaryNumbers", binaryNumbers);
	
	binaryNumbers.shift();
	
	deliciousColors = ColorListOperators.colorListFromColorScaleFunctionAndNumberList(deliciousColorFunction, binaryNumbers, true);
	//piecesColors = deliciousColors;
	
	alphas = binaryNumbers.getNormalizedToMax();
	
	
	var border = 10;//10;
	
	piecesAmplified = pieces.factor(10);
	
	points = new Polygon();
	
	var binNumber;
	var piece;
	var frame;
	var outside;
	var nAttempts;
	var nOutside = 0;
	for(i=0; posts[i]!=null; i++){
		binNumber = DELICIOUS_DATA_OBJECT.array[i].binNumber;
		if(binNumber==0){
			points[i] = new Point(100000,0);
			DELICIOUS_DATA_OBJECT.array[i].x = 100000;
			DELICIOUS_DATA_OBJECT.array[i].y = 0;
			nOutside++;
			continue;
		}
		piece = piecesAmplified[binNumber-1];
		//c.log('DELICIOUS_DATA_OBJECT.array[i].binNumber', DELICIOUS_DATA_OBJECT.array[i].binNumber);
		//c.log('piece', piece);
		frame = piece.getFrame();
		outside = true;
		nAttempts = 0;
		while(outside && nAttempts<1500){
			p = new Point(frame.x+Math.random()*frame.width, frame.y+Math.random()*frame.height);
			nAttempts++;
			if(PolygonOperators.bezierPolygonContainsPoint(piece, p, 15)){
				outside = false;
				nAttempts=0;
			}
		}
		
		points[i] = p.factor(0.1);
		DELICIOUS_DATA_OBJECT.array[i].x = Math.floor(points[i].x*100)/100;
		DELICIOUS_DATA_OBJECT.array[i].y = Math.floor(points[i].y*100)/100;
	}
	
	c.log('points.length', points.length);
	c.log('nOutside', nOutside);
	c.log('points.getFrame()', points.getFrame());
	c.log('DELICIOUS_DATA_OBJECT', DELICIOUS_DATA_OBJECT);
	
	JSONUtils.stringifyAndPrint(DELICIOUS_DATA_OBJECT);
	
	
	resizeWindow();
	
	return;
}


deliciousColorFunction = function(n){
	n = Math.pow(n, 0.1);
	//return ColorOperators.grayscale(n);
	return ColorScales.grayToOrange(Math.pow(n, 3));
}

onLoadIcons = function(e){
	iconsImages = e.result;
	
	if(iconsImages.length==iconsNamesExtended.length) {
		//Loader.loadData("./resources/deliciousALL.xml", onLoadDeliciousDataXML, this);
		Loader.loadData("./resources/data.json", onLoadData, this);
		
		tagsNumbers = new NumberList();
		for(var i=0; iconsImages[i]!=null; i++){
			tagsNumbers[i]=0;
		}
	}
}
