/*
Routing module will provide a way to route requests in many ways
*/
var goose = (function () {
    var configs = {
        CONTEXT: "/",
		CACHE:false,
		CACHE_REFRESH:false,
		//Auth support parameter
		AUTH_SUPPORT:false,
		/*
			Authenticated user's roles are stored in the below config
		*/
		AUTH_USER_ROLES:undefined
    };
    // constructor
	// Will be using a hash rather than an array to access routes via hash
    var routes = {};
	var log = new Log();
	var route = function (route, action, verb, roles) {
        //contains VERB and the route
		if(configs.CACHE){
			if(routes[routeOverload(route+"|"+verb)]==undefined){
				routes[routeOverload(route+"|"+verb)] = {route:routeOverload(route), verb:verb, action:action, roles:roles};
				log.debug("--------Goose CACHE enabled --------" + verb);
			}
			return;
		}
		routes[routeOverload(route+"|"+verb)] = {route:routeOverload(route),verb:verb,action:action, roles:roles};
    };
    var module = function (conf) {
        mergeRecursive(configs, conf);
		if(configs.CACHE){
			var r = application.get("jaggery.goose.routes");
			if(r==undefined){
				application.put("jaggery.goose.routes",routes);
			}else{
				routes=r;
			}
			route("cacherefresh",function(ctx){
				application.put("jaggery.goose.routes", undefined);
			}, "GET");
		}else{
			application.put("jaggery.goose.routes", undefined);
		}
    };
	function isArrayOverlap(array1, array2){
		for (var i = array1.length - 1; i >= 0; i--){
			var array1Element = array1[i];
			for (var j = array2.length - 1; j >= 0; j--){
				var array2Element = array2[j];
				if(array1Element==array2Element){
					return true;
				}
			};
		};
		return false;
	}
    function routeOverload(route) {
        return configs.CONTEXT + route;
    }

    function mergeRecursive(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = mergeRecursive(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }
	
    // prototype
    module.prototype = {
        constructor: module,
        route: route,
		get: function (route, action, roles) {
            this.route(route, action, "GET" , roles);
        },	
		post: function (route, action) {
            this.route(route, action, "POST");
	    },
		put: function (route, action) {
            this.route(route, action, "PUT");
	    },
		delete : function(route, action){
			this.route(route, action, "DELETE");
		},
		setupRules: function(jsonFile){
			for (var property in routes){
				if(routes.hasOwnProperty(property)){
					var routeObject = routes[property];
					log.debug('--------Goose Rule setup current route --------'+routeObject.route);
					var r = jsonFile[routeObject.route];
					if(r==undefined){
						log.debug('--------Goose No Rule specified for route --------'+routeObject.route);
						continue;
					}
					r = r[routeObject.verb];
					if(r==undefined){
						log.debug('--------Goose No Rule specified for route method --------'+routeObject.verb);
						continue;
					}
					routeObject.roles = r; 
					log.debug('--------Goose Rule setup authorized roles for route --------'+routeObject.roles);
				}
			}
		},
		process: function (request) {
			var matched = false;
			for (var property in routes){
				if(routes.hasOwnProperty(property)){
					var routeObject = routes[property];
					log.debug("Goose Router Object"+stringify(routeObject));
	                var routeAction = routeObject.action;
	                var route = routeObject.route;
	                var verb = routeObject.verb;
	                var uriMatcher = new URIMatcher(request.getRequestURI());
					log.debug('--------Request URI--------'+request.getRequestURI());
	                if (uriMatcher.match(route) && request.getMethod() == verb) {
						log.debug('--------Goose Match--------');
						if(configs.AUTH_SUPPORT){
							if(routeObject.roles!=undefined){
								if(configs.AUTH_USER_ROLES==undefined){
									 log.debug("--------Goose Auth Error (User roles not found)--------");
									 response.sendError(403);
									 return;
								}
								log.debug('--------Goose Route roles--------'+routeObject.roles);
								log.debug('--------Goose User roles--------'+configs.AUTH_USER_ROLES);
								var authState = isArrayOverlap(configs.AUTH_USER_ROLES, routeObject.roles);
								if(!authState){
									 log.debug("--------Goose Auth Error (User roles doesn't match with route roles)--------");
									 response.sendError(403);
									 return;
								}
							}else{
								log.debug("--------Goose Auth No Rules found for route--------");
							}
						}
	                    
						var elements = uriMatcher.elements();
	                    var ctx = elements;
	                    log.debug("--------Goose Verb --------" + verb);
	                    log.debug("--------Goose Route --------" + route);
						log.debug("--------Goose Elements --------");
						log.debug(elements);
						
						var jResult = {};
						if(verb=="GET"){
							jResult = request.getAllParameters('UTF-8');
						}else{
							jResult = request.getAllParameters('UTF-8');
							log.debug("--------Goose ContentType --------"+request.getContentType());
							if(request.getContentType().indexOf('application/json') !== -1){
								mergeRecursive(jResult,request.getContent());
							}
						}
						ctx.files = request.getAllFiles();
						
						log.debug("--------Goose parsed data--------- ");
						log.debug(jResult);
	                    ctx = mergeRecursive(jResult,ctx);
	
						log.debug("--------Goose final data--------- ");
						log.debug(jResult);
	                    routeAction(ctx);
						matched = true;
	                    break;
	                }
				}
			}
			if(!matched){
				response.sendError(404);
			}
        }
        
    };
    // return module
    return module;
})();