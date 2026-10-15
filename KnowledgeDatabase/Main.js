var configurationColors = {
  backGroundColor:'black',
  colors:true,
  mousewheel:false,
  delicious:false,
  opaquePieces:1,
  colorAdditionMode:0,
  crows:false,
  centers:false,
  draggable:true,
  text:Texts.COLORS_TEXT,
  transformation3D:true,
  transformationDefault:{
    k:0.02,
    q:0
  }
}

var configurationDelicious = {
  backGroundColor:'white',
  colors:false,
  mousewheel:true,
  delicious:true,
  opaquePieces:1,
  colorAdditionMode:0,
  crows:false,
  centers:false,
  draggable:false,
  text:Texts.DELICIOUS_TEXT,
  transformation3D:false,
  automaticNavigation:false,
  filterType:0,
  filterIconsType:0,
  transformationDefault:{
    k:0.02,
    q:5
  }
}


///to retrieve data:
//1. https://api.del.icio.us/v1/posts/all
//2. https://api.del.icio.us/v1/posts/all?todt=2007-03-13T00:06:00Z <-- using last date, etc…


var PRESENTATION_MODE=true;


var configuration = configurationDelicious;

var transformation;

var URL_SETS = './resources/sets.svg';
var URL_PIECES = './resources/pieces.svg';
var URL_CENTERS = './resources/centers.svg';
var URL_COLORSNAMES = './resources/colorsNames.csv';

var COLOR_ADDITION_MODE = configuration.colorAdditionMode;

var loadingData = true;

var piecesBases = new PolygonList();
var pieces = new PolygonList();
var sets = new PolygonList();

var piecesT = new PolygonList();
var setsT = new PolygonList();

var piecesColors;
var setsColors;
var setsColorsRGB;
var piecesColorsRGB;

var piecesColorReferences;
var setsColorReferences;

var colorTable;
var loadedCenters;
var centers = new Polygon();
var centersT = new Polygon();
var weights;

var points = new Polygon();
var pointsT;
var deliciousColors;

var colorNamesTable;

var k=configuration.transformationDefault.k;
var q=configuration.transformationDefault.q;
var q2=q+1;

var follow_mX = 0;
var follow_mY = 0;

var R;
var center;
var rigidCenter;

var dragging;
var engine3D;
var rotationVector = new Point(0,0);
var pA = new Point3D(0,0,100); //used to check side
var limA = 0.99;//0.6;
var limB = 1.01;//3;
//var sideA = true;
var currentAngles = new Point3D(0,0,0);

var nLinksInPieces;
var binNumber = 0;
var lastBinNumber;
var colorsToFollow;
var colorsFollowers;
var timerToStartColorsFollowing=0;


/////delicious

var delicious_data;
var iconsImages = [];
var linkPanel;
var timeLine;
var textFilter;
var setsFilter;
var categoryTags;
var iOver;

var i0 = 0;
var i1;
var nLinks;
var nActive;

var texts;
var zoomScroll;

// ART INTERFACE SCIENCE LANGUAGE TECHNOLOGY HUMANISM NETWORKS

var categories = [
  'ART',
  'INTERFACE',
  'SCIENCE',
  'LANGUAGE',
  'TECHNOLOGY',
  'HUMANISM',
  'NETWORKS'
];

var actives = new NumberList(1,1,1,1,1,1,1);

var protowords = [
  'ART',
  'INTER',
  'SCI',
  'LAN',
  'TECH',
  'HUMA',
  'NET'
];

var iconsTags = [
  '[project]',
  '[wikipedia_article]',
  '[image]',
  '[compilation]',
  '[video]',
  '[post_blog]',
  '[blog]',
  'moebio',
  '[portfolio]',
  '[pdf]',
  '[person]',
  '[book]',
  '[institution]',
  '[pinterest]',
  '[game]',
  '[data_repository]'
];
var iconsTagsExtended = iconsTags.concat(new StringList('!', '!!', '!!!'));

var iconsActives = ListGenerators.createListWithSameElement(iconsTagsExtended.length, 1);

var tagsNumbers;

var iconsNames = new StringList(
  'project',
  'wikipedia',
  'image',
  'compilation',
  'video',
  'post_blog',
  'blog',
  'moebio',
  'portfolio',
  'pdf',
  'people',
  'book',
  'institution',
  'pinterest',
  'game',
  'data_repository'
);
var iconsNamesExtended = StringList.fromArray(iconsNames.concat(new StringList('!', '!!', '!!!')));

var sevenBases = [
  / art | design | illustration | sculpture | paper | origami | typography | digital_arts | animation | photography | color | music | dance | movies /,
  / interaction | interface | games | tool | cybernetics | usability | toy /,
  / science | math | geometry | topology | algorithm | numbers | biology | physics | astronomy | chemistry | genetics | bacteria | emergence | chaos | geology | ethology | evolution | bioinformatics | brain | neuroscience | electromagnetism | energy | temperature /,
  / philosophy | literature | text | language | linguistics | books | narrative | folksonomy | humor | hypernarrative | typography | science-fiction /,
  / technology | geek | internet | code | digital_arts | gis | cybernetics | java | algorithm | electromagnetism | electricity | iphone | twitter | facebook | microsoft | html5 | flickr /,
  / psychology | sociology | geek | community | cognition | perception | education | politics | religion | city | history | philosophy | history /,
  / network | graph | social_network /
];

var hashTagBlocks;

var requireFilter = [];

//automatic selection
var selectedSets = new NumberList();
var selectionCursorFollow = new Point(0,0);
var qToFollow;
var selectedPieceIndex = -1;
var selectedBinNumber;
var overSetNameIndex;

var mouseOnCircle = false;

init=function(){
  setBackgroundColor(configuration.backGroundColor);

  if(hashTag!=null && hashTag!=""){
    hashTagBlocks = hashTag.substr(1).split("&");
  }

  transformation = configuration.transformation3D?transformation3D:zoomTransformation;

  setsColors = new ColorList();
  setsColorsRGB = new List();
  var rgb;
  for(var i=0; sevenBases[i]!=null; i++){
    rgb = ColorOperators.HSVtoRGB(360*i/sevenBases.length, 1, 1);
    setsColorsRGB[i] = rgb;
    setsColors[i] = ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
  }

  if(configuration.mousewheel) addInteractionEventListener('mousewheel', wheel, this);

  addInteractionEventListener("mouseup", this.onMouse, this);

  texts = new Texts();

  if(configuration.delicious){
    linkPanel = new LinkPanel();
    timeLine = new TimeLine();
    textFilter = new TextFilter();
    setsFilter = new SetsFilter();
    categoryTags = new IconsTags();
  }

  Loader.loadData(URL_CENTERS, onLoadCenters, this);

  END_CYCLE_DELAY = 3000;

  zoomScroll = new ZoomScroll();

  cycleOnMouseMovement(true);
}

draggingListener=function(draggingVector){
  rotationVector = draggingVector;
}
onMouse=function(event){
  if(texts.open) return;
  if(configuration.delicious){
    if(mouseOnCircle){
      window.open(delicious_data.array[iOver].link);
    } else if(configuration.automaticNavigation){
      if(overSetNameIndex!=null){
        if(selectedSets.indexOf(overSetNameIndex)==-1){
          selectedSets.push(overSetNameIndex);
        } else {
          selectedSets.removeElement(overSetNameIndex);
        }
      }

      selectedBinNumber = 0;

      for(var i=0; selectedSets[i]!=null; i++){
        selectedBinNumber+=Math.pow(2, selectedSets[i]);
      }

      selectedPieceIndex = selectedBinNumber-1;
      setSelectionCursor();
    }
  }
}

wheel=function(e){
  if(!configuration.automaticNavigation){
    q2 = Math.min(Math.max(q2*(1-0.03*e.value), 1), 21);
    q = q2-1;

    //zoomScroll.t = q/20;
    zoomScroll.inactive = true;
  }
}

resizeWindow = function(){
  var leftMargin = 210;
  var w = cW-leftMargin;

  var yM = cH-40;

  R = (configuration.delicious?0.75:0.86)*Math.min(cH, w)*0.5;
  center = rigidCenter = new Point(Math.floor(180+(cW-180)*0.5), Math.floor(yM*0.5)+5);

  piecesT = pieces.factor(2*R/100);
  setsT = sets.factor(2*R/100);
  centersT = centers.factor(2*R/100);

  if(configuration.delicious){
    pointsT = points.factor(2*R/100);

    categoryTags.setFrame(new Rectangle(10, 100, 150, Math.min(cH-270, 700) ));
    setsFilter.setFrame(new Rectangle(10,yM, 0, 20));
    textFilter.setFrame(new Rectangle(setsFilter.frame.x-220, texts.open?5000:yM, 200, 20));
    timeLine.setFrame(new Rectangle(20, yM-50,cW-40, 20));
  }

  if(configuration.transformation3D) engine3D.lens = R*1.1;

  pA = new Point3D(0,0,R);

  texts.resizeWindow();

  if(configuration.automaticNavigation){
    setSelectionCursor();
  }

  zoomScroll.x = cW - 240;
  zoomScroll.y = 50;

  enterFrame();
}

setSelectionCursor = function(){
  if(selectedPieceIndex==-1){
    qToFollow = 0;
    selectionCursorFollow = center;
  } else {
    selectionCursorFollow = centersT[selectedPieceIndex];
    qToFollow = nLinksInPieces[selectedPieceIndex]*0.06+1;
  }
}


cycle=function(){
  canvas.style.cursor = 'default';

  if(configuration.automaticNavigation){
    q = 0.9*q + 0.1*qToFollow;
    follow_mX = 0.9*follow_mX + 0.1*selectionCursorFollow.x;
    follow_mY = 0.9*follow_mY + 0.1*selectionCursorFollow.y;
  } else {
    follow_mX = 0.8*follow_mX+0.2*mX;
    follow_mY = 0.8*follow_mY+0.2*mY;
  }

//  if(configuration.delicious) center = rigidCenter.addCoordinates((rigidCenter.x-follow_mX)*q*0.005, (rigidCenter.y-follow_mY)*q*0.005);

  mouseOnCircle = Math.pow(mX-center.x, 2)+Math.pow(mY-center.y, 2) < R*R+q*10;

  zoomScroll.draw();

  //////////binNumber and inSet
  lastBinNumber = binNumber;

  var inSet;
  var dna="";
  binNumber = 0;
  var tags = "";
  var inSets = [];

  var angle;
  var pC;
  var r = R+(configuration.delicious?2:25);

  var textColor;
  var protoword='';

  overSetNameIndex = null;

  for(var i=0; setsT[i]!=null; i++){
    inSet = configuration.automaticNavigation?selectedSets.indexOf(i)!=-1:PolygonOperators.polygonContainsPoint(setsT[i].add(center), new Point(follow_mX, follow_mY));
    dna+=inSet?"X":" ";
    binNumber += inSet?Math.pow(2, i):0;
    if(inSet){
      tags+=", "+categories[i];
      inSets.push(i);
      textColor = 'black';
      protoword+=protowords[i];
    } else {
      textColor = 'rgb(200,200,200)';
    }

    if(configuration.delicious){
      angle = -(TwoPi*i/7)-Math.PI*0.44;
      pC = transformation(new Point(r*Math.cos(angle), r*Math.sin(angle)));
      DrawTexts.setContextTextProperties(textColor, 16, LOADED_FONT, (pC.x<center.x?'right':'left'), (pC.y<center.y?'bottom':'top'));
      context.fillText(categories[i], pC.x, pC.y);
      if(!mouseOnCircle && pC.distanceToPoint(mP)<100) overSetNameIndex = i;
    }
  }

  //////////pieces

  var pColors;
  var set;
  var subCenter;
  var subBinNumber;

  context.lineWidth = 1;
  context.strokeStyle=configuration.colors?'black':'rgba(0,0,0,0.2)';

  if(configuration.colors && (!configuration.draggable || (!crows && !dragging.dragging)) && inSets.length>0){
    if(lastBinNumber!=binNumber){
      colorsFollowers = piecesColors.clone();
      colorsToFollow= new ColorList();
      for(var j=0; centersT[j]!=null; j++){
        subCenter = centersT[j];
        subBinNumber = 0;
        for(i=0; inSets[i]!=null; i++){
          set = setsT[inSets[i]];
          subBinNumber += PolygonOperators.polygonContainsPoint(set, subCenter)?Math.pow(2, inSets[i]):0;
        }
        colorsToFollow[j] = (subBinNumber>0)?piecesColors[subBinNumber-1]:'black';
      }
      timerToStartColorsFollowing = 0;
    }

    timerToStartColorsFollowing++;

    if(timerToStartColorsFollowing>30){
      if(colorsToFollow==null) colorsToFollow = piecesColors;
      if(colorsFollowers==null) colorsFollowers = new ColorList();
      for(j=0; colorsToFollow[j]!=null; j++){
        colorsFollowers[j] = ColorOperators.interpolateColors(colorsFollowers[j], colorsToFollow[j], 0.1);
      }
      pColors = colorsFollowers;
    } else {
      pColors = piecesColors;
    }
  } else {
    pColors = piecesColors;
  }


  drawPolygonList(piecesT, configuration.colors?pColors:null);


  //////////sets

  var xC = center.x + r*Math.cos(Math.PI*0.3);
  var yC = center.y + R - 20;

  context.lineWidth = 2;
  context.strokeStyle = 'white';//'rgb(80,80,80)';//

  var refColorObject;

  for(i=0; inSets[i]!=null; i++){
    context.strokeStyle='black';
    drawPolygon(setsT[inSets[i]]);

    angle = -TwoPi*inSets[i]/7-Math.PI*0.44;
    pC = transformation(new Point(r*Math.cos(angle), r*Math.sin(angle)));

    //peripherical circle

    if(configuration.delicious){

    } else {
      context.fillStyle = setsColors[inSets[i]];
      context.beginPath();
      context.arc(pC.x, pC.y, 10*pC.z, 0, TwoPi);
      context.fill();
    }


    if(!configuration.delicious){
      //equation circles
      context.beginPath();
      context.arc(xC + i*30, yC, 9, 0, TwoPi);
      context.fill();

      //equation texts
      if(setsColorReferences!=null){
        refColorObject = setsColorReferences[inSets[i]];
        DrawTexts.setContextTextProperties('white', 13, LOADED_FONT);
        DrawTexts.fillTextRotated(context, refColorObject.name, xC + i*30+6, yC-15, -0.25*Math.PI);
      }

      //equation symbols
      DrawTexts.setContextTextProperties('white', 14, LOADED_FONT, 'center', 'middle');
      context.fillStyle = 'white';
      context.fillText((inSets[i+1]!=null)?'+':'=', xC + (i+0.5)*30, yC);
    }
  }

  //highlighted polygon

  if(binNumber!=0){
    context.lineWidth = 4;
    context.strokeStyle=false?piecesColors[binNumber-1]:(configuration.colors?'white':'black');
    drawPolygon(piecesT[binNumber-1]);
  }


  //last equation circle and text
  if(!configuration.delicious){
    if(binNumber!=0){
      context.fillStyle = piecesColors[binNumber-1];
      context.beginPath();
      context.arc(xC + i*30+5, yC, 12, 0, TwoPi);
      context.fill();

      if(setsColorReferences!=null){
        refColorObject = piecesColorReferences[binNumber-1];
        DrawTexts.setContextTextProperties('white', 14, LOADED_FONT);
        DrawTexts.fillTextRotated(context, refColorObject.name, xC + i*30+12, yC-20, -0.25*Math.PI);
      }
    }
  }


  //crows

  if(configuration.centers){
    for(var i=0;centersT[i]!=null;i++){
      if(crows) drawCrow(centersT[i], colorTable[i]);
      if(configuration.centers) drawBigPoint(centersT[i], 'white');
    }
  }

  //delicious points

  if(configuration.delicious){
    DrawTexts.setContextTextProperties('black', 14, LOADED_FONT, 'right');
    context.fillText(protoword, cW - 20, cH - 60);
    drawDeliciousPoints();
    timeLine.draw();
    textFilter.draw();
    setsFilter.draw();
    categoryTags.draw();
  }

  texts.draw();
}

drawPolygonList = function(polygonList, colors){
  for(var i=0; polygonList[i]!=null; i++){
    drawPolygon(polygonList[i], colors!=null?colors[i]:null);
  }
}

drawPolygon = function(polygon, color){
  if(color!=null) context.fillStyle = color;
  context.beginPath();
  Draw.drawBezierPolygonTransformed(context, polygon, transformation);
  context.stroke();
  if(color!=null) context.fill();
}

drawPoint = function(p, color){
  p = transformation(p).clone();
  context.fillStyle = color;
  context.beginPath();
  context.arc(p.x, p.y, 0.5*p.z, 0, TwoPi);
  context.fill();
}

drawBigPoint = function(p, color){
  p = transformation(p).clone();
  context.fillStyle = color;
  context.beginPath();
  context.arc(p.x, p.y, 5*p.z, 0, TwoPi);
  context.fill();
}

drawDeliciousPoints = function(){
  var p;
  context.fillStyle = 'black';

  var minD2 = 9999999;
  var pOver;

  var linkObject;

  var image;
  var s;

  var minS = Math.min(3000/nActive, 15);
  var factor = 3000*3000/nActive;

  context.strokeStyle = 'black';
  context.lineWidth = 0.5;
  DrawTexts.setContextTextProperties('black', 11, 'Arial', 'center', 'middle');

  for(var i=i0; i<i1; i++){
    linkObject = delicious_data.array[i];

    //if(pointsT[i]>10000 || !linkObject.active) continue;
    if(!linkObject.active) continue;

    p = transformation(pointsT[i]);

    var d2 = Math.pow(p.x-mX, 2)+Math.pow(p.y-mY, 2);

    if(d2<minD2){
      iOver = i;
      minD2 = d2;
      pOver = p;
    }

    image = linkObject.image;

    s = Math.min(Math.pow(p.z-1, 2)*factor/(d2+0.1), 19)+minS;

    if(s>10){
      if(image != null) {
        context.drawImage(image, p.x-s*0.5, p.y-s*0.5, s, s);//, Math.round(0.6*p.z), Math.round(0.6*p.z));
      } else {
        context.beginPath();
        context.arc(p.x, p.y, s*0.5, 0, TwoPi);
        context.fill();
      }

      switch(linkObject.stars){
        case 0:
          break;
        case 3:
          context.beginPath();
          context.arc(p.x, p.y, s*0.5+12, 0, TwoPi);
          context.stroke();
        case 2:
          context.beginPath();
          context.arc(p.x, p.y, s*0.5+8, 0, TwoPi);
          context.stroke();
        case 1:
          context.beginPath();
          context.arc(p.x, p.y, s*0.5+4, 0, TwoPi);
          context.stroke();
      }

    } else {
      context.beginPath();
      context.arc(p.x, p.y, s*0.5, 0, TwoPi);
      context.fill();
    }

  }

  if(!mouseOnCircle) pOver = null;

  image = null;
  if(delicious_data!=null){
    linkObject = delicious_data.array[iOver];
    image = linkObject.image;
    if(pOver!=null){
      if(linkObject.stars>0){
        context.beginPath();
        context.arc(pOver.x, pOver.y, 22, 0, TwoPi);
        context.stroke();
      }
      if(linkObject.stars>1){
        context.beginPath();
        context.arc(pOver.x, pOver.y, 26, 0, TwoPi);
        context.stroke();
      }
      if(linkObject.stars>2){
        context.beginPath();
        context.arc(pOver.x, pOver.y, 30, 0, TwoPi);
        context.stroke();
      }
    }
  }


  if(pOver!=null){
    linkPanel.setLink(iOver);
    linkPanel.draw(pOver.x, pOver.y);

    if(image!=null){
      context.drawImage(image, pOver.x-18, pOver.y-18, 37, 37);
    } else {
      context.fillStyle = 'black';
      context.beginPath();
      context.arc(pOver.x, pOver.y, 18, 0, TwoPi);
      context.fill();
    }
  }
}


combineFilters = function(){
  var text = textFilter.text.toLowerCase();
  var linkObject;
  nActive = 0;

  allActives = actives.getSum()==7 && configuration.filterType==0;
  var allIconsActives = iconsActives.getSum() == iconsActives.length;

  var matchActives;
  var matchIconsActives;

  switch(configuration.filterType){
    case 0:
      matchActives = matchActivesOR;
      break;
    case 1:
      matchActives = matchActivesAND;
      break;
    case 2:
      matchActives = matchActivesEXCLUSIVE;
      break;
  }

  switch(configuration.filterIconsType){
    case 0:
      matchIconsActives = matchIconsActivesOR;
      break;
    case 1:
      matchIconsActives = matchIconsActivesAND;
      break;
    case 2:
      matchIconsActives = matchIconsActivesEXCLUSIVE;
      break;
  }

  for(var j=0; iconsNamesExtended[j]!=null; j++){
    tagsNumbers[j] = 0;
  }

  for(i=0; i<nLinks; i++){
    linkObject = delicious_data.array[i];
    linkObject.active = (linkObject.title.toLowerCase().indexOf(text)!=-1 || linkObject.description.toLowerCase().indexOf(text)!=-1 || linkObject.tagsString.indexOf(text)!=-1) && (allActives || matchActives(linkObject)) && (allIconsActives || matchIconsActives(linkObject));
    if(linkObject.active && i>=i0 && i<i1){
      nActive++;
      for(j=0; iconsNamesExtended[j]!=null; j++){
        if(linkObject.tags.indexOf(iconsTagsExtended[j])!=-1) tagsNumbers[j]++;
      }
    }
  }

  c.log('nActive:', nActive);

  tagsNumbers = tagsNumbers.getNormalizedToMax();

  writeHashTag();

  enterFrame();
}

//sets

matchActivesOR = function(linkObject){
  for(var i=0; i<7; i++){
    if(linkObject.powers[i]==1 && actives[i]==1) return true;
  }
  return false;
}
matchActivesAND = function(linkObject){
  for(var i=0; i<7; i++){
    if(actives[i]==1 && linkObject.powers[i]==0) return false;
  }
  return true;
}
matchActivesEXCLUSIVE = function(linkObject){
  for(var i=0; i<7; i++){
    if((actives[i]==1 && linkObject.powers[i]==0) || (actives[i]==0 && linkObject.powers[i]==1)) return false;
  }
  return true;
}

//icons

matchIconsActivesOR = function(linkObject){
  for(var i=0; iconsActives[i]!=null; i++){
    if(iconsActives[i]==1 && linkObject.icons[i]==1) return true;
  }
  return false;
}

matchIconsActivesAND = function(linkObject){
  for(var i=0; iconsActives[i]!=null; i++){
    if(iconsActives[i]==1 && linkObject.icons[i]==0) return false;
  }
  return true;
}

matchIconsActivesEXCLUSIVE = function(linkObject){
  for(var i=0; iconsActives[i]!=null; i++){
    if((iconsActives[i]==1 && linkObject.icons[i]==0) || (iconsActives[i]==0 && linkObject.icons[i]==1)) return false;
  }
  return true;
}


updateNActives = function(){
  var linkObject;

  for(var j=0; iconsNamesExtended[j]!=null; j++){
    tagsNumbers[j] = 0;
  }

  nActive = 0;
  for(var i=i0; i<=i1; i++){
    linkObject = delicious_data.array[i];
    nActive+=delicious_data.array[i].active?1:0;
    for(j=0; iconsNamesExtended[j]!=null; j++){
      if(linkObject.tags.indexOf(iconsTagsExtended[j])!=-1) tagsNumbers[j]++;
    }
  }

  writeHashTag();

  tagsNumbers = tagsNumbers.getNormalizedToMax();
}


writeHashTag = function(){
  var hT = '';
  if(i0!=0 || i1!=(nLinks-1)){
    hT = '('+numberToText(timeLine.subIntervalNorm.x)+','+numberToText(timeLine.subIntervalNorm.y)+')';
  }

  if(actives.getSum()!=7){
    hT+=(hT==''?'':'&')+'c='+NumberOperators.numberFromBinaryValues(actives);

    if(configuration.filterType!=0){
      hT+= '&f='+(configuration.filterType==1?'AND':'Exclusive');
    }
  }

  //if(actives.getSum()!=7 && configuration.filterType!=0) hT+= 'f='+(configuration.filterType==1?'AND':'Exclusive');

  if(iconsActives.getSum()!=iconsActives.length){
    hT+=(hT==''?'':'&')+'i='+NumberOperators.numberFromBinaryValues(iconsActives);

    if(configuration.filterIconsType!=0){
      hT+= '&F='+(configuration.filterIconsType==1?'AND':'Exclusive');
    }
  }

  if(textFilter.text!='') hT+=(hT==''?'':'&')+'s='+encodeURI(textFilter.text);

  window.location.hash = hT;
}

numberToText = function(n){
  if(n==1) return '100';
  return String(Math.round(n*100)/100).substr(2);
}


//ZOOM
zoomTransformation = function(point){
  var v = new Point(point.x+center.x-follow_mX, point.y+center.y-follow_mY);
  var norm = v.getNorm();
  var factor = expand(norm)/norm;
  var p = v.factor(factor);

  return new Point3D(follow_mX+p.x, follow_mY+p.y, factor);
}

expand = function(d){
  return d + (q*d/(1+(Math.pow(k*d,2))));
}



