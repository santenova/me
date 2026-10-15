var pool = {
	loading:{
		API_MODE: "production", // Possible states: "local", "local_dynamic", "production"
		URL_BASE_PRODUCTION:"/ross_api/static/",
		URL_BASE_LOCAL:'./data_resources/tables/',
		URL_BASE_LOCAL_DYNAMIC:"http://curriculum.int/ross_api/index.php/export/",
		URL_PANELS_TABLE:'https://docs.google.com/spreadsheet/pub?key=0At94558jIRmcdEpsR3l4a05vS1ZheXB1T0tPcEJlMGc&single=true&gid=0&output=csv',
		URL_BASE_IMAGES:'/Spiral_Model_Images/',
		URL_CENTRAL_POINT_INDEX:'./SpiralRLSMapping.csv',
		URL_CENTRAL_POINT_BASEPATH:'http://174.143.70.203/main/',
		URL_MINI_SPIRAL_IMAGE:'./images/microSpiral.png',
		filesNames:['ecologies', 'mentalities', 'bifurcations', 'grades', 'domains', 'courses', 'units', 'les', 'integrations', 'threads'],
		gidNumbers:[0,1,2,3,4,5,13,12,7,6,8,14,9,11],
		nLoaded:0,
		loadingData:true,
		minSpiralImage:new Image()
	},

	typeTitles:{
		ecology: 'Ecology',
		 mentality: 'Mentality',
		 bifurcation: 'Bifurcation',
		 grade: 'Grade',
		 domain: 'Domain',
		 course: 'Course',
		 eu: 'eu',
		 outcome: 'Outcome',
		 unit: 'Unit',
		 le: 'Learning Experience',
		 integration: 'Integrated Project',
		 assessment: 'Assessment',
		 outcome_eu: 'Outcome EU',
		 thread: 'Thread',
		 standard: 'Standard'
	},

	dates:{
		referenceDates:new NumberList(),
		globalMinDate:null,
		globalMaxDate:null,
		globalTimeSpan:null
	},

	frames:{
		wPanel:440,
		frame:null,
		tlFrame:null,
		ecoFrame:null,
		menFrame:null,
		bifFrame:null,
		sliderFrame:null,
		tlProjectionFrame:null,
		centerX:null,
		mouseInCanvas:true,
		mouseInRuler:false
	},

	ui:{
		slider:null
	},

	tD:{
		e3D:null,
		dragging:null,
		dragged:true,
		rotationVector:null,
		scale:0,
		scaleDestiny:0.0004,
		angle:-12.5*TwoPi,
		alfa:0,
		gama:Math.PI,
		leaned:false,
		angleDestiny:-9*TwoPi,
		iGrade:12,
		following:false,
		polygon3DList:null,
		va:1,
		wideView:1,
		zoomFactor:100
	},

	spiral:{
		ACTIVE:true,
		N_STEPS_PER_PERIOD:70,
		GROW_FACTOR:0.1,
		ANGULAR_TORSION:2,
		RADIAL_FACTOR:0.05,
		VERTICAL_FACTOR:70,
		EXCENTRICITY:1,//inactivated
		CYCLES_OFFSET:8,
		V_FOLLOW_ANGULAR:0.96,
		CENTER_X:0,
		DOMAINS_WIDTH:1.2,
		LIMIT_SCALE_DOMAINS:0.01,
		LIMIT_SCALE_LES:0.15,
		LIMIT_REALSCALE_ALPHA:0.5,
		LIMIT_REALSCALE:0.2,
		LIMIT_REALSCALE_AMP:0.3
	},

	interaction:{
		nClicksOnRuler:0,
		oveInterfaceButton:false
	},

	submenus:{
		timeline:{
			title:'MENTALITIES',
			open:false,
			y:2000,
			vertical:true
		},
		timelineUnits:{
			title:'UNITS',
			open:false,
			y:2000,
			vertical:false
		},
		viewOptions:{
			title:'CUSTOMIZATION',
			open:false,
			y:2000,
			vertical:false,
			options:[
				{
					name:'domains',
					varName:'DRAW_DOMAINS'
				},
				{
					name:'threads',
					varName:'DRAW_THREADS'
				},
				{
					name:'units',
					varName:'DRAW_UNITS'
				},
				{
					name:'integration',
					varName:'DRAW_INTEGRATIONS'
				},
				{
					name:'learning experiences',
					varName:'DRAW_LES'
				},
			]
		},
		help:{
			title:'HELP',
			open:false,
			y:2000,
			vertical:false
		}
	},

	objectsInteraction:{
		overObject:null,
		overObjectOnFrame:null,
		selectedObject:null
	},

	viewParams:{
		VIEW_MODE:1, //0:timeline, 1:spiral
		DRAW_LES:true,
		DRAW_THREADS:true,
		DRAW_DOMAINS:true,
		DRAW_UNITS:false,
		DRAW_INTEGRATIONS:true,
		H_MENUS:120,
		V_RULER:84,
		X_RULER:0,
		W_ECOLOGIES:17,
		RULER_STATE:1,
		BEGINNER:true,
		PANEL_OPEN:true,
		MENTALITIES:false,
		COLORED_LES:true,
		ADDING_FAKE_ELEMENTS:false,
		OPEN_COUNT:0,
		LAST_OPEN_DATE:0,
		LES_INTERACTION_RADIUS_COMP:4,
		LES_INTERACTION_RADIUS_TOUCH:10,
		LES_INTERACTION_RADIUS:0,
		ZOOM_ON_SELECTION_FACTOR:265,
		ZOOM_ON_GRADE_FACTOR:180
	},

	tables:{
		tablesList:new List(),
		coursesMatrix:null,
		listsByType:{},
		panelsTable:null,
		mentalititesTable:null
	},

	modelObjects:{
		ecologies:null,
		mentalities:null,
		bifurcations:null,
		grades:null,
		domains:null,
		courses:null,
		units:null,
		les:null,
		threads:null,
		integrations:null,
		standards:null,
		outcomes:null,
		outcome_eus:null
	},

	toggleList:{
		ecologies:null,
		mentalities:null,
		bifurcations:null,
		grades:null,
		domains:null,
		courses:null,
		units:null,
		les:null,
		threads:null,
		integrations:null,
		standards:null,
		outcomes:null,
		outcome_eus:null
	},



	infoPanelInitialized: false
}

var device_checker = {
	is_android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	is_blackberry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	is_iphone: function() {
		return navigator.userAgent.match(/iPhone/i);
	},
	is_ipad: function() {
		return navigator.userAgent.match(/iPad/i);
	},
	is_ipod: function() {
		return navigator.userAgent.match(/iPod/i);
	},
	is_ios: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	is_windows_phone: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	is_mobile: function() {
		//return (device_checker.is_android() || device_checker.is_blackberry() || device_checker.is_ios() || device_checker.is_windows_phone() );
		return (device_checker.is_android() || device_checker.is_blackberry() || device_checker.is_iphone() || device_checker.is_ipod() || device_checker.is_windows_phone() );
	}

};

if( device_checker.is_mobile() ){
	alert( "This site is not yet fully optimized for handheld devices. For the best user experience, please access using a computer. Thanks." );
}

// Check touch device
pool.isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
pool.spiralMoving = true;

// Change look and feel of specific items in case of isTouch
if( pool.isTouch ){
	$("#helpPanelShowButton").css("-webkit-transform", "scale(1.8)");
	$("#helpPanelShowButton").css("bottom", "50px");
	$("#helpPanelShowButton").css("left", "10px");
	$(".helpTip_03").css("right", "430px");
	$(".helpTip_04").css("display", "none");
	$(".helpTip_05").css("bottom", "155px");
	$(".helpTip_05").css("left", "13px");
	$(".helpTip_01").attr("src", "images/help/images/timeline_touch.png");
	$(".helpTip_02").attr("src", "images/help/images/zoom_touch.png");
	$(".helpTip_05").attr("src", "images/help/images/help_touch.png");
	console.log( "isTouch!" );
}
// if( pool.isTouch ){
// 	alert( "IS touch!" );
// }else{
// 	alert( "Is NOT touch" );
// }

var coordinatesObject = {};
coordinatesObject.les = [];
coordinatesObject.ips = [];
coordinatesObject.domains = [];


var ADD_CHROME_ERROR_HACK = true; // AS LONG AS CHROME ISSUE WITH setInterval persists, this must remain true

init=function(){

	//drawImage = fTextRotated = fText = sText = fsText = bezier = bezierM = fCircle = fCircleM = sCircle = sCircleM = fsCircle = fsCircleM =  line = fRect = fRectM = sRect = sRectM = fsRect = fsRectM = function(){}

	switch(pool.viewParams.VIEW_MODE){
		case 0:
			//cycleOnMouseMovement(true);
			pool.ui.slider = new TimeSlider();
			pool.frames.tlProjectionFrame = new Rectangle();
			break;
		case 1:
			END_CYCLE_DELAY = 20000;
			pool.viewParams.CENTER_X = cW*0.5;
			pool.viewParams.X_RULER = cW;
			//cycleOnMouseMovement(true);
			init3D();
			break;
	}

	cycleOnMouseMovement(true);


	var selScrollable = '.scrollable';
	// Uses document because document will be topmost level in bubbling
	$(document).on('touchmove',function(e){
	  e.preventDefault();
	});
	// Uses body because jQuery on events are called off of the element they are
	// added to, so bubbling would not work if we used document instead.
	$('body').on('touchstart', selScrollable, function(e) {
	  if (e.currentTarget.scrollTop === 0) {
	    e.currentTarget.scrollTop = 1;
	  } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
	    e.currentTarget.scrollTop -= 1;
	  }
	});
	// Stops preventDefault from being called on document if it sees a scrollable div
	// $('body').on('touchmove', selScrollable, function(e) {
	//   e.stopPropagation();
	// });
	$('body').on('touchmove', selScrollable, function(e) {
	    // Only block default if internal div contents are large enough to scroll
	    // Warning: scrollHeight support is not universal. (http://stackoverflow.com/a/15033226/40352)
	    if($(this)[0].scrollHeight > $(this).innerHeight()) {
	        e.stopPropagation();
	    }
	});


	onResize();
	analyzeCookie();
	initLoading();
	initInteraction();

	if(pool.isTouch) window.addEventListener('orientationchange', function(){
		console.log('orientation changed');
		onResize();
	});
}



endProcess = function(){
	if(pool.viewParams.VIEW_MODE==1){

		pool.tD.angles = new Point3D(-3.8,pool.tD.angleDestiny,0);
		pool.tD.e3D.setAngles(pool.tD.angles);
		pool.tD.rotationVector.x = 0.001;
		pool.tD.rotationVector.y = 0.003;

		//prepareAnglesToStartFollowing();

		placeObjectsOnSpiral();
		placeIntegrationsOnSpiral();
		buildSpirals();

	}

	startCycle();
	allLoaded();
	initSidePanelContaner();
	initHelp();

	// c.l('/////////////');
	// domainCoordinates();
	// c.l(JSON.stringify(coordinatesObject));
	// c.l('/////////////');
}

adjustMainFrame = function(){
	pool.frames.frame = new Rectangle(20,20,cW-40 - 85,cH);//-40-(cH-(Math.min(pool.submenus.timeline.y, pool.submenus.timelineUnits.y, pool.submenus.viewOptions.y, pool.submenus.help.y))));
	pool.frames.frame.right = pool.frames.frame.getRight();

	pool.frames.centerX = pool.frames.frame.x + pool.frames.frame.width*0.5;
	pool.frames.centerY = pool.frames.frame.y + pool.frames.frame.height*0.55;
}

resizeWindow = function(){
	adjustMainFrame();
	repositionHelpElements();

	if(pool.isTouch){
		followAngle(pool.tD.angleDestiny);
	}

	if(pool.viewParams.VIEW_MODE!=0){
		enterFrame();
		return;
	}


	pool.frames.frame.bottom = pool.frames.frame.getBottom();

	var H_TIMES = 100;

	pool.frames.ecoFrame = new Rectangle(pool.frames.frame.x, pool.frames.frame.y, pool.frames.frame.width, H_TIMES);
	pool.frames.ecoFrame.bottom = pool.frames.ecoFrame.getBottom();
	pool.frames.menFrame = new Rectangle(pool.frames.frame.x, pool.frames.ecoFrame.getBottom()+10, pool.frames.frame.width, H_TIMES);
	pool.frames.menFrame.bottom = pool.frames.menFrame.getBottom();
	pool.frames.bifFrame = new Rectangle(pool.frames.frame.x, pool.frames.menFrame.getBottom()+10, pool.frames.frame.width, H_TIMES);
	pool.frames.bifFrame.bottom = pool.frames.bifFrame.getBottom();

	pool.frames.tlFrame = new Rectangle(pool.frames.frame.x,pool.frames.bifFrame.getBottom()+20,pool.frames.frame.width,pool.frames.frame.height-pool.frames.bifFrame.getBottom()-60);
	pool.frames.tlFrame.right = pool.frames.tlFrame.getRight();
	pool.frames.tlFrame.bottom = pool.frames.tlFrame.getBottom();

	pool.frames.sliderFrame = new Rectangle(pool.frames.frame.x, pool.frames.tlFrame.bottom+5, pool.frames.frame.width, pool.frames.frame.bottom - pool.frames.tlFrame.bottom - 10);
	pool.frames.sliderFrame.right = pool.frames.sliderFrame.getRight();
	pool.frames.sliderFrame.bottom = pool.frames.sliderFrame.getBottom();

	pool.frames.tlProjectionFrame.y = pool.frames.tlFrame.y;
	pool.frames.tlProjectionFrame.height = pool.frames.tlFrame.height;



	reStartCycle();
}


cycle=function(){

	if(!pool.spiral.ACTIVE) return;

	if(pool.loading.loadingData){
		clearContext();
		setText('gray', 18);
		fText('loading '+pool.loading.filesNames[pool.loading.nLoaded], 20, 20);
		return;
	}

	setCursor('default');
	var overSomeObject = pool.objectsInteraction.overObjectOnFrame!=null;
	pool.objectsInteraction.overObjectOnFrame = null;

	adjustMainFrame();

	switch(pool.viewParams.VIEW_MODE){
		case 0:
			pool.ui.slider.draw();
			pool.frames.tlProjectionFrame.width = pool.frames.tlFrame.width/pool.ui.slider.amp;
			pool.frames.tlProjectionFrame.x = pool.frames.tlFrame.x - pool.frames.tlProjectionFrame.width*pool.ui.slider.x0;
			drawEcoMenBif();
			drawUnits();
			if(pool.viewParams.DRAW_THREADS) drawThreads();
			drawCursor();
			break;
		case 1:
			draw();
			break;
	}

	if(pool.isTouch){
		if(MOUSE_DOWN && pool.frames.mouseInCanvas && overSomeObject && pool.objectsInteraction.overObjectOnFrame==null) unOverObject();
	} else {
		//if(pool.frames.mouseInCanvas && overSomeObject && pool.objectsInteraction.overObjectOnFrame==null) unOverObject();
	}

	// if(pool.objectsInteraction.overObject!=null && !pool.frames.mouseInCanvas && !pool.objectsInteraction.overObject.overOnPanel) {
		//c.l('~~~~~ /// ');
		//unOverObject();
	// }
}



//overriding Global's onMouseMove to include mouseInCanvas detection
var prevOnMouseMove = _onMouse;//_onMouseMove;

_onMouse = function(e){
	prevOnMouseMove(e);
	if(e.type=='mousemove') pool.frames.mouseInCanvas = true;
}


//overriding onResize to reduce canvas

onResize = function(e){
	if(canvasResizeable==false) return;

	canvas.setAttribute('width', document.body.clientWidth-pool.frames.wPanel);
    //canvas.setAttribute('height', document.body.clientHeight);
    canvas.setAttribute('height', window.innerHeight /* document.body.clientHeight */); // Using this to make it work on ipad

	cW = context.canvas.width;//  = window.innerWidth;
	cH = context.canvas.height;// = window.innerHeight;

	cX = Math.floor(cW*0.5);
	cY = Math.floor(cH*0.5);

	resizeWindow();
}
