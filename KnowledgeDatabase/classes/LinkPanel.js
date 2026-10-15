


function LinkPanel(){
  this.i;
  this.title;
  this.wT;
  this.nF = 0;

  this.descriptionBox = new TextBox({
    width:200,
    height:2000
  });
};


LinkPanel.prototype.setLink = function(i){
  if(i!=this.i){
    this.i = i;

    var linkObject = delicious_data.array[i];
    this.title = linkObject.title;
    DrawTexts.setContextTextProperties('white', 12);
    this.wT = context.measureText(this.title).width;

    var text = (linkObject.description==""?"/no description/":linkObject.description)+"\\n\\n"+linkObject.tags.join(', ');

    this.descriptionBox.setText(text);

    // c.log('\n\nthis.title:', this.title);
    // c.log('TAGS:', linkObject.tags);
    // c.log('binNumber:', linkObject.binNumber);
    // c.log('powers:', linkObject.powers);

    this.nF = 0;
  } else {
    this.nF++;
  }
};


LinkPanel.prototype.draw = function(x, y){
  var maxW = Math.max(22+this.wT, 32+this.descriptionBox.width);
  var x0T = (x+maxW>cW)?-(42+this.wT):0;
  var x0D = (x+maxW>cW)?-(52+this.descriptionBox.width):0;

  if(this.nF>40){
    context.fillStyle = 'rgba(255,255,255,0.7)';
    context.fillRect(0, 0, cW, cH);
    context.fillStyle = 'rgba(0,0,0,0.1)';
    context.fillRect(0, 0, cW, cH);
  }

  context.fillStyle = 'rgba(0,0,0,0.9)';
  context.fillRect(x0T+x+22, y-5, this.wT, 13);

  DrawTexts.setContextTextProperties('white', 12);
  context.fillText(this.title, x0T+x+22, y-6);

  if(this.nF>40){
    context.fillStyle = 'white';
    context.fillRect(x0D+x+20, y+10, this.descriptionBox.width+12, this.descriptionBox.height+8);

    this.descriptionBox.x = x0D+x+26;
    this.descriptionBox.y = y+14;

    this.descriptionBox.draw();

  }
}


