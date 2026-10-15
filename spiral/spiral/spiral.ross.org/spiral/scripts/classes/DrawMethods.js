drawDomainsFlower = function(object, ctxt, x, y, radius){
	radius-=2.5;

	var i;
	var objectDomains = object.domains;
	var allDomains = pool.modelObjects.domains;

	// ------------------------------------------------
	// Beginning of subdomain management
	// (Convert Subdomains to their parent domain, to make the flower kee its initial petal number)
	var cleanDomains = [];
	for ( i = 0; i < allDomains.length; i++) {
		var domain = allDomains[i];
		// If it's a subdomain, change it for its parent
		if( domain.parent_id ){
			domain = getObjectById( "d_" + domain.parent_id );
		}
		// If not present in the clean list, add it
		if( cleanDomains.indexOf( domain ) == -1 ){
			cleanDomains.push( domain );
		}
	};
	allDomains = cleanDomains;

	// Now do the same with the object domains
	cleanDomains = [];
	for ( i = 0; i < objectDomains.length; i++) {
		var domain = objectDomains[i];
		// If it's a subdomain, change it for its parent
		if( domain.parent_id ){
			domain = getObjectById( "d_" + domain.parent_id );
		}
		// If not present in the clean list, add it
		if( cleanDomains.indexOf( domain ) == -1 ){
			cleanDomains.push( domain );
		}
	};
	objectDomains = cleanDomains;

	// End of subdomain management
	// ------------------------------------------------

	var domain;
	var r0 = (5.7/11)*radius;
	var r1 = (5.3/11)*radius;
	var dA = TwoPi/(allDomains.length-1);
	var xi,yi;
	var highlighted;
	var oldContext = context;
	var over;
	
	context = ctxt;

	setLW(1);

	for(i=0; allDomains[i]!=null; i++){
		domain = allDomains[i];
		if(i==0){
			xi = x;
			yi = y;
		} else {
			xi = x + r0*Math.cos(i*dA);
			yi = y + r0*Math.sin(i*dA);
		}
		highlighted = objectDomains.indexOf(domain)!=-1;
		setFill(ColorOperators.addAlpha(domain.color, highlighted?0.6:0.1));
		if(fCircleM(xi, yi, r1)){
			over = domain;

			setCursor('pointer');

			setStroke('white');
			setLW(1);

			sCircle(xi, yi, r1+2);
		};
		if(highlighted){
			setStroke(0,0,0,0.2);
			
			sCircle(xi, yi, r1+2);
		}
	}

	// setFill(255,255,255,0.6); // white
	setFill( 4,104,57, 0.1 );
	fCircle(x, y, r1);

	context = oldContext;

	if(over) overObject(over);
}


drawDomainsFlowerSimple = function(object, ctxt, x, y, radius){
	var i;
	var domains = object.domains;
	var r0 = (5/11)*radius;
	var r1 = (6/11)*radius;
	var dA = TwoPi/domains.length;

	var oldContext = context;
	context = ctxt;

	for(i=0; domains[i]!=null; i++){
		setFill(domains[i].colorTransparent);
		fCircle(x + r0*Math.cos(i*dA), y + r0*Math.sin(i*dA), r1);
	}

	context = oldContext;
}