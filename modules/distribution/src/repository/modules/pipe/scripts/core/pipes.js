/*
 Description: The following script implements a simple middleware stack similar to connect.js
 In fact, the implementation was heavily inspired by the above mentioned library.
 It involves an array of plug-ins (equivalent to middleware) to be executed one after the
 other based on matching routes.
 A set of default plug-ins are provided in the plug-ins folder of this module.
 These include:
 1. A simple routing plug-in aptly called simpleRouter
 2, A request logging plug-in which simply logs the request to the console  (simpleRequestLogger)
 3. A tenant parser which parses the url to identify tenantId (assuming the tenant url is {context}/t/{tid}
 (simpleTenantParser)
 */
//var pipes = {};
var plug;
var initialize;
var resolve;
var list;
var o;
var final;

(function () {
    'use strict';

    var plugins = [];
    var finalHandler = function () {
    };   //An empty final handler,does nothing

    var DEFAULT_ROUTE = '/';
    var context = DEFAULT_ROUTE;
    var ANON_HANDLER = 'anon';
    var log = new Log();
    var emptyHandler = function (req, res, session, handlers) {
        handlers();
    };

    //var environment = defaultEnvironment;

    var PARAM_HANDLER_NAME = 'name';
    var PARAM_HANDLER_FUNCTION = 'handle';
    var PARAM_HANDLER_ROUTE = 'route';
    var PARAM_HANDLER_SOURCE = 'source';
    var PARAM_OVERRIDING_HANDLER_NAME = 'override';


    /*
     The function is used to resolve the parameters passed into the install
     method
     */
    var resolveParams = function (args) {
        var params = {};
        var log=new Log();
        params[PARAM_HANDLER_NAME] = ANON_HANDLER;
        params[PARAM_HANDLER_FUNCTION] = emptyHandler;

        if (args.length > 1) {
            params[PARAM_HANDLER_ROUTE] = args[0].substring(1);//Drop the leading slash
            params[PARAM_HANDLER_SOURCE] = args[1];
        } else {
            params[PARAM_HANDLER_ROUTE] = DEFAULT_ROUTE;
            params[PARAM_HANDLER_SOURCE] = args[0];
        }

        return params;
    };

    /**
     * The function is used to set a function which will executed after all of the plugins
     * @param handler The handler that will be executed after all of the handlers
     */
    var setFinal = function (handler) {
        finalHandler = handler;
    };

    /**
     * The function attaches the source based on the argument type
     * @param arg
     */
    var resolveSource = function (src) {
        var log=new Log();
        if (src instanceof Function) {
            log.info('Is a function');
            return src;
        }
        else if (src instanceof Object) {
            if (!src[PARAM_HANDLER_FUNCTION]) {
                throw "The plugin has no handle method";
            }
            log.info('Is an object');
            return src.handle;
        }
        else {
            throw "The plugin must be either a function or object with a handle method";
        }
    };

    /*
     The function is used to resolve overriding parameters
     */
    var getOverridingPluginName = function (params) {
        var source = params[PARAM_HANDLER_SOURCE];
        var overridenHandler = source.hasOwnProperty(PARAM_OVERRIDING_HANDLER_NAME) ? source[PARAM_OVERRIDING_HANDLER_NAME]
            : null;

        return overridenHandler;
    };

    /*
     The function is used to determine the name of the handler passed into the install method
     If no name is provided then it is considered an anonymous handler, and thus cannot be
     overridenn.
     */
    var resolveHandlerName = function (params) {

        //Obtain the script object
        var source = params[PARAM_HANDLER_SOURCE];
        var name = source.hasOwnProperty(PARAM_HANDLER_NAME) ? source[PARAM_HANDLER_NAME] : ANON_HANDLER;
        params[PARAM_HANDLER_NAME] = name;
    };

    /*
     The function is used to obtain the handler for the provided plugin
     */
    var resolveHandler = function (params) {
        var source = params[PARAM_HANDLER_SOURCE];
        var handler = resolveSource(source);//source.hasOwnProperty(PARAM_HANDLER_FUNCTION) ? source[PARAM_HANDLER_FUNCTION] : emptyHandler;
        params[PARAM_HANDLER_FUNCTION] = handler;
    };

    var isRouteHandled = function (req, context, route) {

        //Remove the context
        var uri = req.getRequestURI().replace(context, '');

        log.info(uri.indexOf(route));
        if (uri.indexOf(route) != -1) {
            log.info('The route matches');
            return true;
        }


        return false;
    };

    /*
     The function is used to print a list of all installed plug-ins
     */
    var debugListAllHandlers = function () {
        var plugin;
        for (var index in plugins) {
            plugin = plugins[index];
            log.info(stringify(plugin));
        }
    };

    /*
     The function is used to install a new plug-in
     */
    var install = function () {

        var params = resolveParams(arguments);
        resolveHandlerName(params);
        resolveHandler(params);
        plugins.push(params);
    };

    /*
     The function is used to handle a request by passing it through a chain of
     plug-ins.
     */
    var handle = function (req, res, session, context) {
        var log = new Log();

        var plugin;
        var index = 0;
        var url = req.getRequestURI();
        url = url.replace(context, '');
        var currentPlugin;
        var recursiveHandle = function (err) {

            currentPlugin = plugins[index];
            index++;
            //Skip the use of plug-ins if the routes do not match
            if ((currentPlugin) && (url.indexOf(currentPlugin.route) < 0)) {
                return recursiveHandle(err);
            }

            //Check if we have reached the end of the plugin chain
            if (!currentPlugin) {
                if (err) {
                    log.debug('No error handlers have been specified - and we have reached the end of the plug-in chain!');
                }

            } else {
                //Check if there is an error to be handled
                if (err) {
                    //Check if the current plugin can handle the error!
                    if (currentPlugin.handle.length == 5) {
                        //currentPlugin.handle(err, req, res, session, recursiveHandle);

                        //Execute the handler within a try block so we can catch any errors
                        try {
                            currentPlugin.handle(err, req, res, session, recursiveHandle);
                        } catch (e) {
                            recursiveHandle(e);
                        }
                    }
                    //Throw the error again!
                    else {
                        recursiveHandle(err);
                    }
                } else { //No error , but we still need to execute the current plugin logic

                    if (currentPlugin.handle.length < 5) {
                        //currentPlugin.handle(req, res, session, recursiveHandle);

                        //Execute within a try catch to allow errors to be propergated by error handlers
                        try {
                            currentPlugin.handle(req, res, session, recursiveHandle);
                        } catch (e) {
                            recursiveHandle(e);
                        }
                    }
                    else {
                        //If this is an error handler we need to omit it and move to the next handler
                        recursiveHandle();
                    }
                }
            }
        };

        recursiveHandle();
        finalHandler(req, res, session);

    };

    /*
     The method returns a particular plugin based on the name and the route.
     If a route is not provided then the default route is used for the matching.
     */
    var getPlugin = function (name, route) {
        var plugin;

        if(!route) {
          route = DEFAULT_ROUTE;
        }

        for (var index in plugins) {
            plugin = plugins[index];

            if ((plugin[PARAM_HANDLER_NAME] == name) && (plugin[PARAM_HANDLER_ROUTE] == route)) {
                return plugin;
            }
        }
        return null;
    };

    /*
     The function is used to override a specific plugin
     */
    var override = function () {
        var log = new Log();
        var params = resolveParams(arguments);
        var route = params[PARAM_HANDLER_ROUTE] || DEFAULT_ROUTE;
        var overriddenPluginName = getOverridingPluginName(params);

        var overriddenPlugin = overriddenPluginName ? getPlugin(overriddenPluginName, route) : null;
        var source = params[PARAM_HANDLER_SOURCE];
        //Only override if a plugin was returned
        if (overriddenPlugin) {
            overriddenPlugin[PARAM_HANDLER_SOURCE] = source;
            overriddenPlugin[PARAM_HANDLER_FUNCTION] = source[PARAM_HANDLER_FUNCTION];
            return;
        }

        log.info('Unable to override ' + overriddenPluginName + ' as it has not been installed');
        return;
    };

    /*
     The function is used to initialize the pipe by calling an init method found in the object
     */
    var init = function (obj) {
        if (obj.hasOwnProperty('init')) {
            obj.init(this);
        }
    };

    //pipes.handle = handle;
    //pipes.plug = install;
    //pipes.override = override;
    //pipes.listAllHandlers = debugListAllHandlers;
    //pipes.init=init;

    resolve = handle;
    plug = install;
    o = override;
    list = debugListAllHandlers;
    initialize = init;
    final = setFinal;

}());