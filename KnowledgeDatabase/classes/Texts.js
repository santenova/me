Texts.prototype.constructor=Texts;


Texts.TEXT = "";


function Texts(){

  this.title = "<fcBlack><fs16></f><fs16>";// | <e0*+ info></f>";

  this.titletBox = new TextFieldHTML({
    'text':this.title,
    x:20,
    y:20,
    width:400,
    height:4000,
    target:this,
    linkFunction:this.clickLink
  });

  this.textBox = new TextFieldHTML({
    'text':Texts.TEXT,
    x:100,
    y:160,
    width:1000,
    height:4000
  });

  this.loadingStart = new TextFieldHTML({
    'text':'<fcBlack><fs64>loading data…</f></f>',
    x:100,
    y:5000,
    width:1000,
    height:4000
  });

  this.titletBox.draw();
  this.textBox.draw();
  this.loadingStart.draw();

  this.open = true;

  this.resizeWindow();
}

Texts.prototype.clickLink = function(e){
  switch(e){
    case "0":
      this.open = true;
      this.titletBox.setText(this.title);
      this.textBox.setText(Texts.TEXT);
      this.textBox.y = 160;
      this.dataLoaded();
      break;
    case "1":
      this.open = false;
      this.titletBox.setText(this.title);
      this.textBox.setText("");
      this.textBox.y = 5000;
      this.loadingStart.setText("");
      break;
  }
  resizeWindow();
}

Texts.prototype.resizeWindow = function(){
  this.textBox.width = cW-200;
  this.textBox.draw();

  this.loadingStart.x = loadingData?cW-430:cW-250;
  this.loadingStart.y = this.open?cH-490:500;
  this.loadingStart.draw();
}

Texts.prototype.draw = function(){
  if(this.open){
    context.fillStyle = 'rgba(255,255,255,0.4)';
    context.fillRect(0,0,cW,cH);

    context.fillStyle = 'rgba(255,255,255,0.95)';
    context.fillRect(10,10,cW-20,cH-20);
  }

}

Texts.prototype.dataLoaded = function(e){
  this.loadingStart.setText('<fcBlack><fs64><e1*START></f></f>');
  if(PRESENTATION_MODE){
    this.clickLink("1");


  }
}
