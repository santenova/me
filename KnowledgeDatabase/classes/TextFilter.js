function TextFilter(){
  this.frame;

  this.input = new InputTextFieldHTML({
    'y':-1000,
    'target':this,
    'width':400,
    'height':40,
    'fontSize':18,
    'changeFunction':this.change
  });


  this.text='';
}

TextFilter.prototype.change = function(id){
  this.text= this.input.getText();

  combineFilters();
}

TextFilter.prototype.draw = function(){
  this.input.draw();
}

TextFilter.prototype.setFrame = function(frame){
  this.frame = frame;

  this.input.x = frame.x;
  this.input.y = frame.y-2;
  this.input.width = frame.width;
  this.input.height = frame.height;
}

TextFilter.prototype.setText = function(text){
  this.input.setText(text);
}
