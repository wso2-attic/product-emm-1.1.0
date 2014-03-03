
	/*
	Description: NOT USED- REMOVE THIS!
	TODO: Remove
	Filename:rxt.domain.js
	Created Date: 28/7/2013
	*/
var router_module = function() {

	function RouterAction(url, cb) {
		this.url = url;
		this.cb = cb;
	}
	
	RouterAction.prototype.invoke=function(l){
		l.debug('invoked');
	}

	function RouterService(noun) {
		this.noun = noun;
		this.verbs = {};
	}

	RouterService.prototype.register = function(verb, url, cb, l) {
		l.debug('verb: ' + verb);
		var str=""+verb+"";

		this.verbs[str] =new RouterAction(url, cb);
		l.debug(stringify(this.verbs));
		//l.debug('verb count ' + this.verbs.length);
	}

	RouterService.prototype.execute = function(verb, req, res, l) {
		
		var str=""+verb+"";
		
		//Determine if it is a POST verb
		if(str=='POST'){
			this.verbs[str].cb(req,res,req.getAllParameters('UTF-8'));
			return;
		}

		var url=this.verbs[str].url;
		l.debug(url);
		var uriMatcher=new URIMatcher(req.getRequestURI());
		
		//If it is a match send the arguments to the callback
		if(uriMatcher.match(url))	
			this.verbs[str].cb(req,res,uriMatcher.elements());
		else
			res.sendError(404);
	}

	function Router() {
		this.nouns = [];
		
	}

	Router.prototype.route = function(noun, verb, url, cb, l) {
		if(!this.nouns[noun])
			this.nouns[noun] = new RouterService(noun);
		
		this.nouns[noun].register(verb, url, cb, l);
	}

	Router.prototype.exec = function(noun, req, res, l) {
		var reqType = req.getMethod();
	
		this.nouns[noun].execute(reqType, req, res, l);
	}

	// The function determines the action to be executed based on
	// request details
	Router.prototype.handle = function(request) {

		var reqType = request.getMethod();
		var reqURI = request.getRequestURI();
		var contextName = request.getContextPath();

		// Break the reqURI into components
		var seperator = '/';

		// Remove the context path
		var contextOccurence = reqURI.lastIndexOf(contextName);

	}

	return {
		Router : Router
	}
};
