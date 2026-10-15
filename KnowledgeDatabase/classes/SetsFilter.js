function SetsFilter(){
  this.frame;
  this.textsPositions;
  this.filterText = 'OR filter';

  this.pressed = false;
  this.activating;
  this.iOver;

  addInteractionEventListener('mousedown', this.onMouse, this);
  addInteractionEventListener('mouseup', this.onMouse, this);
}

SetsFilter.prototype.onMouse = function(e){
  this.pressed = false;
  if(mY<this.frame.y-6 || mX<this.frame.x || e.type=='mouseup') return;
  if(mY<this.frame.y+10){
    if(mX<(this.frame.x + 80)){
      configuration.filterType = (configuration.filterType+1)%3;
      this.setFilterType();
    }
  } else {
    this.pressed = true;

    if(this.iOver != null){
      if(actives.getSum()==actives.length){
        actives[this.iOver] = 1;
        for(var i=0; actives[i]!=null; i++){
          if(i!=this.iOver) actives[i]=0;
        }
      } else {
        actives[this.iOver] = 1-actives[this.iOver];
      }
      this.activating = actives[this.iOver];
      if(actives.getSum()==0){
        for(var i=0; actives[i]!=null; i++){
          actives[i]=1;
        }
      }
    }
  }
  combineFilters();
}

SetsFilter.prototype.setFilterType = function(){
  switch(configuration.filterType){
    case 0:
      this.filterText = 'OR filter';
      break;
    case 1:
      this.filterText = 'AND filter';
      break;
    case 2:
      this.filterText = 'Exclusive filter';
      break;
  }
}

SetsFilter.prototype.setFrame = function(frame){
  this.frame = frame;
  this.textsPositions = [];
  DrawTexts.setContextTextProperties('black', 15, LOADED_FONT);
  var x0 = frame.x;
  for(var i=0; categories[i]!=null; i++){
    this.textsPositions[i] = x0;
    x0+=context.measureText(categories[i]).width + 15;
  }
  this.textsPositions[i] = x0;

  this.frame.width = x0 - frame.x;
}


SetsFilter.prototype.draw = function(){
  if(mY>this.frame.y-6 && mX>this.frame.x) canvas.style.cursor = 'pointer';

  DrawTexts.setContextTextProperties('black', 12, LOADED_FONT);
  context.fillText(this.filterText, this.frame.x, this.frame.y-5);

  DrawTexts.setContextTextProperties('black', 15, LOADED_FONT);

  var previousOver = this.iOver;
  this.iOver = null;

  for(var i=0; categories[i]!=null; i++){
    context.fillStyle = actives[i]==0?'rgb(200,200,200)':'black';
    context.fillText(categories[i], this.textsPositions[i], this.frame.y+12);

    if(mX>this.textsPositions[i] && mX<this.textsPositions[i+1]) this.iOver = i;
  }

  if(this.pressed && (this.iOver!=previousOver)){
    actives[this.iOver] = this.activating;
    combineFilters();
  }
}
