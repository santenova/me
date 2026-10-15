
function TimeLine(){
  this.frame;
  this.months;
  this.intervals;
  this.max;

  this.mouseInFrame=false;

  this.subInterval = new Interval();
  this.subIntervalNorm = new Interval(0,1);
  this.subRectangle = new Rectangle();

  this.draggingLeft = false;
  this.draggingRight = false;
  this.draggingAll = false;
  this.clickInterval;

  addInteractionEventListener('mousedown', this.onMouse, this);
  addInteractionEventListener('mouseup', this.onMouse, this);
}

TimeLine.prototype.onMouse = function(e){
  this.draggingLeft = false;
  this.draggingRight = false;
  this.draggingAll = false;

  switch(e.type){
    case 'mousedown':
      //var verticalIn = mY>this.frame.y && mY<this.frame.getBottom();
      if(this.mouseInFrame){
        if(mX<this.subInterval.x+6 && mX>this.frame.x-6){
          this.draggingLeft = true;
        } else if(mX>this.subInterval.y-6 && mX<this.frame.getRight()+6){
          this.draggingRight = true;
        } else if(mX>=this.subInterval.x+6 && mX<=this.subInterval.y-6){
          this.draggingAll = true;
          this.clickInterval = new Interval(mX-this.subInterval.x, this.subInterval.y-mX);
        }
      }
      break;
    case 'mouseup':
      break;
  }

}

TimeLine.prototype.setFrame = function(frame){
  this.frame = frame;

  this.subInterval.x = frame.x + frame.width*this.subIntervalNorm.x;
  this.subInterval.y = frame.x + frame.width*this.subIntervalNorm.y;

  this.subRectangle.x = this.subInterval.x;
  this.subRectangle.width = this.subInterval.getAmplitude();
  this.subRectangle.y = frame.y;
  this.subRectangle.height = frame.height;
}

TimeLine.prototype.setData = function(dataObject){
  this.months = new NumberList();
  this.intervals = new List();

  var array = dataObject.array;

  var item;
  var nMonth;

  for(var i=0; array[i]!=null; i++){
    nMonth = array[i].date.getMonth()+(array[i].date.getFullYear()-2007)*12;
    if(this.months[nMonth]==null){
      this.months[nMonth] = 1;
      this.intervals[nMonth] = new Interval(i, i);
    } else {
      this.months[nMonth]++;
      this.intervals[nMonth].x = Math.min(this.intervals[nMonth].x, i);
      this.intervals[nMonth].y = Math.max(this.intervals[nMonth].y, i);
    }
  }

  var currentMonth = (2012-2007)*12 + 11;
  this.max = 0;
  for(var i=0; i<currentMonth; i++){
    if(this.months[i]==null){
      this.months[i] = 0;
      this.intervals[i] = new Interval(0, 0);
    }
    this.max = Math.max(this.max, this.months[i]);
  }


  if(this.months[currentMonth-1]==0){
    this.months.pop();
    this.intervals.pop();
  }

  this.months = this.months.applyFunction(Math.sqrt).getNormalizedToMax();

  this.max = 1;

  this.updateIntervals();
}

TimeLine.prototype.setValues = function(v0, v1){
  this.subIntervalNorm.x = v0;
  this.subIntervalNorm.y = v1;

  this.setFrame(this.frame);
  this.updateIntervals();
}

TimeLine.prototype.draw = function(){
  if(this.months==null) return;

  this.mouseInFrame = mY>this.frame.y-6 && mY<this.frame.getBottom()+6 && mX<this.frame.getRight()+6 && mX>this.frame.x-6;

  if(this.mouseInFrame) canvas.style.cursor = 'pointer';

  if(mX>this.frame.getRight()+100 || mY<this.frame.y-100) this.draggingLeft = this.draggingRight = this.draggingAll = false;

  if(this.draggingLeft){
    this.subInterval.x = Math.min(Math.max(mX, this.frame.x), this.frame.getRight()-4);
    this.subInterval.y = Math.max(this.subInterval.x+4, this.subInterval.y);
    this.updateIntervals();
  } else if(this.draggingRight){
    this.subInterval.y = Math.min(Math.max(mX, this.frame.x+4), this.frame.getRight());
    this.subInterval.x = Math.min(this.subInterval.y-4, this.subInterval.x);
    this.updateIntervals();
  } else if(this.draggingAll){
    this.subInterval.x = Math.min(Math.max(mX - this.clickInterval.x, this.frame.x), this.frame.getRight()-this.clickInterval.getAmplitude());
    this.subInterval.y = Math.min(Math.max(mX + this.clickInterval.y, this.frame.x + this.clickInterval.getAmplitude()), this.frame.getRight());
    this.updateIntervals();
  }


  var dX = this.frame.width/this.months.length;
  var dY =  this.frame.height/this.max;
  var cY = this.frame.y + this.frame.height*0.5;

  context.fillStyle = 'rgb(120,120,120)';

  for(var i=0; this.months[i]!=null; i++){
    context.fillRect(this.frame.x+dX*i, cY-0.5*dY*this.months[i], dX-2, dY*this.months[i]);
  }

  context.strokeStyle = 'rgb(100,100,100)';
  context.lineWidth = 6;

  context.beginPath();
  context.moveTo(this.subRectangle.x+3, this.subRectangle.y-3);
  context.lineTo(this.subRectangle.x-3, this.subRectangle.y-3);
  context.lineTo(this.subRectangle.x-3, this.subRectangle.getBottom()+3);
  context.lineTo(this.subRectangle.x+3, this.subRectangle.getBottom()+3);
  context.stroke();

  context.beginPath();
  context.moveTo(this.subInterval.y-3, this.subRectangle.y-3);
  context.lineTo(this.subInterval.y+3, this.subRectangle.y-3);
  context.lineTo(this.subInterval.y+3, this.subRectangle.getBottom()+3);
  context.lineTo(this.subInterval.y-3, this.subRectangle.getBottom()+3);
  context.stroke();

  context.fillStyle = 'rgba(0,0,0,0.1)';
  context.fillRect(this.frame.x, this.frame.y, this.subRectangle.x-this.frame.x, this.subRectangle.height);
  context.fillRect(this.frame.getRight(), this.frame.y, this.subInterval.y-this.frame.getRight(), this.subRectangle.height);
}

TimeLine.prototype.updateIntervals = function(){
  this.subRectangle.x = this.subInterval.x;
  this.subIntervalNorm.x = (this.subInterval.x-this.frame.x)/this.frame.width;
  this.subRectangle.width = this.subInterval.getAmplitude();
  this.subIntervalNorm.y = (this.subInterval.y-this.frame.x)/this.frame.width;

  i1 = this.intervals[Math.floor(this.subIntervalNorm.x*this.months.length)].y;
  i0 = this.intervals[Math.ceil(this.subIntervalNorm.y*(this.months.length-1))].x;

  updateNActives();
}
