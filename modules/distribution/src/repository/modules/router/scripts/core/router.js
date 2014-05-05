var name = 'simpleRouter';

var app = {};

/**
 * The default renderer will print the output as a JSON object
 * @param data
 * @param req
 * @param res
 * @param session
 */
var defaultRenderer=function(viewId,data,req,res,session){
    this.addHeader('Content-Type','application/json');
    var log=new Log();
    //Check if only data has been sent
    if(arguments.length==1){

        //Do nothing if the user has only given an id
        if(arguments[0] instanceof String){
            log.info('Please provide a data object to render');
            return;
        }
        log.info('Only data has been provided');
        data=arguments[0];
    }

    print(stringify(data));
};

var handle = function (req, res, session, handlers) {
    var log = new Log();
    var methodType=req.getMethod().toLocaleLowerCase();
    var renderer=app.utils(methodType+'-renderer')||defaultRenderer;
    res.render=renderer;

    var result= app.route(req, res, session);

    if (result.hasOwnProperty('error')) {
        log.info('Route not handled');
        handlers({code: result.error,msg:result.msg});
    }


    //renderer(result.data,req,res,session);
    handlers();
};




var exec = (function (RouteMap) {
    //var RouteMap=require('/themes/default/route-map.js').RouteMap;
    var routes = {};
    var GET_METHOD = 'GET';
    var POST_METHOD = 'POST';
    var PUT_METHOD = 'PUT';
    var DELETE_METHOD = 'DELETE';
    var CONFIG_KEY_RENDERER='renderer';
    var INHERIT_ROUTES=false;
    var config={};
    var log = new Log();


    app.get=function(route,handler){
       register(GET_METHOD,route,handler);
    };

    app.put=function(route,handler){
        register(PUT_METHOD,route,handler);
    };

    app.delete=function(route,handler){
        register(DELETE_METHOD,route,handler);
    };

    app.post=function(route,handler){
        register(POST_METHOD,route,handler);
    };

    app.all=function(route,handler){
        register(GET_METHOD,route,handler);
        register(PUT_METHOD,route,handler);
        register(POST_METHOD,route,handler);
        register(DELETE_METHOD,route,handler);
    };

    app.route=function(req,res,session){
        //Determine the method type
        var method=req.getMethod();

        if((!routes[method])||(!routes[method].map)){
            return { error: 404 , msg:'No routes for the method type', data:{}};
        }

        log.info(routes[method].map);
        var match=routes[method].match(req.getRequestURI());

        if((!match)||(!match.ref)){
            return { error: 404 , msg:'Could not find route! ', data:{}};
        }

        req.params=match.params;
        return match.ref(req,res,session)||{};
        //return {};
    };

    app.config=function(options){
        INHERIT_ROUTES=options.inheritRoutes||false;
    }

    app.utils=function(key,value){

        if(arguments.length==1){
            return config[key];
        }
        else{
            config[key]=value;
        }

    };


    /**
     * The method is used to register a route
     * @param method The HTTP method used for the route
     * @param route  A single route pattern or an array of route patterns
     * @param handler The logic to be executed
     */
    var register=function(method,route,handler){
        //Add the context since the user will only enter resource path

        //Check if the routes contain a reference to the method type,
        //if not create a new RouteMap
        if(!routes.hasOwnProperty(method)){
            routes[method]=new RouteMap({inherit:INHERIT_ROUTES});
        }

        //Determine if the user has passed in a single route or an array
        if(route instanceof  Array){
            for(var index in route){
                //routes[method].add(route[index],handler);
                addRoute(route[index],handler,routes[method]);
            }
        }
        else{
            //routes[method].add(route,handler);
            addRoute(route,handler,routes[method]);
        }
    };

    /**
     * The function appends the route
     * @param route
     * @returns {string}
     */
    var addContext=function(route){
        route='/:context'+route;
        return route;
    }

    var addRoute=function(route,handler,routes){

        log.info('Adding: '+route);
        route=addContext(route);
        routes.add(route,handler);
    }

}(RouteMap));
