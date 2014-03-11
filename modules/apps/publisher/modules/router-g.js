var utility=require('utility.js').rxt_utility();
	/*
	Description: Implements a routing helper which allows
		     execution of logic based on HTTP method type
	Filename:router-.js
	Created Date: 31/7/2013
	*/
var router=function(){
	

	/*
	*/
	function RouteContainer(options){
		this.noun='';
		this.context='';
		this.patterns=[];

		utility.config(options,this);
	}

	RouteContainer.prototype.registerPattern=function(pattern,func){
		var pattern=new RoutePattern({ pattern:pattern,func:func});
		pattern.calculateParamCount();
		this.patterns.push(pattern);
	}

	RouteContainer.prototype.getPatternByPattern=function(target){
		
		for each(var item in this.patterns){
			if(item.pattern==target){
				return item;
			}
		}
		return null;
	}

	RouteContainer.prototype.getPatternByParameters=function(count){
		
		for each(var item in this.patterns){
			if(item.paramCount==count){
				return item;
			}
		}
		return null;
	}

	/*
	Encapsulates data on a single context to pattern
	*/
	function RoutePattern(options){
		this.paramCount=0;
		this.pattern='';
		this.context='';
		this.func=null;

		utility.config(options,this);
	}

	RoutePattern.prototype.calculateParamCount=function(){			
		this.paramCount=getParamCount(this.context,this.pattern);
	}

	

	function Router(){
		this.routes=[];	//The list of routes handled by the router
		this.renderer=new EmptyRendererContainer();	//Does not render by default
		this.rendererLocation='';
	}

	/*
	Registers a noun, pattern and callback function
	@noun : Must be GET,POST,PUT or DELETE
	@context: 
	@pattern: /asset/{param1}/{param2}
	@func: function(context)
	*/
	Router.prototype.register=function(noun,context,pattern,func){
	
		var route=this.isRouteRegistered(noun,context,pattern);

		if(route){

			//Check if the pattern is registered
			if(route.getPatternByPattern(pattern)){
				return;
			}
			
			//Add a new pattern
			route.registerPattern(pattern,func);

			return;
		}

		//Create a new route
		route=new RouteContainer({
				noun:noun,
				context:context,
				pattern:pattern});

		//Add the pattern
		route.registerPattern(pattern,func);
		
		this.routes.push(route);
	}

	/*
	Checks if the route action is registered
	*/
	Router.prototype.isRouteRegistered=function(noun,context,pattern){
		
		//Go through all of the routes
		for each(var item in this.routes){

			if((item.noun==noun)&&(item.context==context)){				
				return item;
			}
		}

		return null;
	}
	

	Router.prototype.getRoutePattern=function(noun,context,paramCount){
				
		//Go through all of the routes
		for each(var item in this.routes){


			
			if((item.noun==noun)&&(item.context==context)){


				var routePattern=item.getPatternByParameters(paramCount);
				//Check if the pattern is registered
				if(routePattern)
				{

					return routePattern;
				}				
				
				return null;
			}
		}

		return null;
	}

	/*
	Locates an appropriate route and executes it 
	*/
	Router.prototype.handle=function(request,response,session){
	
		var method=request.getMethod(),		
			uri=request.getRequestURI(),
			contextPth=request.getContextPath().replace('/','');
		


		var uriMatcher=new URIMatcher(uri);
		paramCount=getParamCount(contextPth,uri);


		//Find the appropriate match
		var route=this.getRoutePattern(method,contextPth,paramCount);

		if(route){
			uriMatcher.match(route.pattern);
			var params=uriMatcher.elements();
			var postParams={};
            var putContent={};
	
			if(method=='POST')
			{
				postParams=request.getAllParameters('UTF-8');
			}

            //Support for PUT
            if(method=='PUT'){
                putContent=request.getContent();
            }
		
			route.func({request:request, 
				 response:response,
				 params:params,
				 post:postParams,
                 content:putContent,
                 session:session||null,
				 renderer:this.renderer});
		}
		else{
			//Issue a page not found error
			this.renderer.error(404);
		}
	}

	
	Router.prototype.setRenderer=function(impl){

		if((impl=='')||(!impl))
		{
			this.renderer=new EmptyRenderContainer;
		}

		this.rendererLocation=impl;
		this.renderer=new RouteRenderContainer(impl);
	}

	function getParamCount(context,uri){
		//Remove the context from the pattern
		var withoutContext=uri.replace('/'+context,'');
		//Break by /
		var paramArray=withoutContext.split('/');
		return paramArray.length;
	}

	/*
	Responsible for rendering the routes
	*/
	function RouteRenderContainer(impl){
		this.impl=impl;	
	}
	
	RouteRenderContainer.prototype.success=function(data){
		var type=require(this.impl).adapter().Renderer;
		var instance=new type();

		if(!isNaN(data)){
			instance.successCode(data);
			return;
		}
		instance.success(data);
	}

	RouteRenderContainer.prototype.error=function(data){
		var type=require(this.impl).adapter().Renderer;
		var instance=new type();
		//if it is a number 
		if(!isNaN(data)){
			instance.errorCode(data);
			return;
		}
		instance.error(data);
	}
		
	/*
	Does nothing
	*/

	function EmptyRendererContainer(){
	}

	EmptyRendererContainer.prototype.success=function(data){
		//Do nothing
		print('empty renderer');
	}
	
	EmptyRendererContainer.prototype.error=function(data){
		//Do nothing
	}

			

	return{
		Router:Router
	};
	
}
