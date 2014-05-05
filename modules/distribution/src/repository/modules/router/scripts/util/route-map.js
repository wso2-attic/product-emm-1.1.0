/**
 * Description: The script is used to construct route trees given a route pattern.After a route can be stored in the
 *              RouteMap with a piece of data (or a function) that is reffered to as the reference.At a later time
 *              a route can matched against any route stored in the map to return the stored reference.
 * Filename: route-map.js
 * Created Date: 17/2/2014
 */
var RouteMap = {};
var LayerStack = {};

var module = (function () {

    var log = new Log('route-map');
    var PARAM_DEFAULT_ROUTE = '';
    var PARAM_REF = '/';
    var DEF_INHERIT_VAL=false; //Dictates whether routes can inherit routes from parents

    function Stack() {
        this.layers = [];
    }

    Stack.prototype.push = function (element) {
        this.layers.push(element);
    };

    Stack.prototype.pop = function () {
        if(this.layers.length==0){
            return null;
        }
        var element = this.layers[this.layers.length-1];
        this.layers = this.layers.slice(0, this.layers.length - 1);
        return element;
    };


    function Routes(options) {
        this.map = {};
        this.config={};
        var options=options||{};
        //Determine if whether inheritance should take place
        //- Inheritance allows a route to backtrack and look for a parent route
        // that may contain a matching route
        this.config.inherit=options.inherit||DEF_INHERIT_VAL;
    }

    Routes.prototype.add = function (route, ref) {
        this.splitToComponents(route, ref);
    };

    Routes.prototype.match = function (route) {
        var components = route.split('/');
        var params = {};
        components = cleanseComponents(components);
        var result = traverse(this.map, components, 0, params,new Stack(),this.config);
        return {params: params, ref: result};
    };

    Routes.prototype.splitToComponents = function (route, ref) {
        var components = route.split('/');
        components = cleanseComponents(components);
        buildMap(this.map, components, 0, ref);
    };

    var traverse = function (mapObj, components, index, params,stack,config) {
        if (components.length <= index) {
            var ref = getRef(mapObj);
            return ref;
        }
        else {
            var comp = components[index];
            index++;
            var def = getDefaultRoute(mapObj);

            //Save the parameter values only if a default route existed
            if (def) {
                //Save the corresponding value
                params[getDefaultRouteName(mapObj)] = comp;

                //Save the default route location in order to allow back tracking
                stack.push({parent:def,ptr:index});
            }
            log.info('component: '+comp);
            //Determine if there is a specific match for the current component
            if (mapObj.hasOwnProperty(comp)) {
                log.info('specific route');
                return traverse(mapObj[comp], components, index, params,stack,config);
            }
            else {

                //If there is no default implementation then stop
                if (!def) {

                    //Check if popping a layer back will give us a default implementation
                    //We currently only support one layer of backtracking
                    var parentLayer=stack.pop();

                    //If the previous layer has a default then take that route
                    //Do not perform back tracking if INHERITANCE is disabled
                    if((parentLayer)&&(config.inherit)){
                        //Rewind the layer
                        index=parentLayer.ptr;

                        return traverse(parentLayer.parent,components,index,params,stack,config);
                    }
                    log.info('No default route');
                    //If not then stop
                    return def;
                }
                log.info('Using default route: '+stringify(def));
                return traverse(def, components, index, params,stack,config);
            }
        }
    };

    var buildMap = function (mapObj, components, index, ref) {
        //Stop building the map if there are no more components to place
        if (components.length <= index) {
            mapObj[PARAM_REF] = ref;
            return;
        }
        else {
            var comp = components[index];
            var cleansed = comp;//removeTokens(comp);

            index++;

            //If a route does not exist then make one
            if (!mapObj.hasOwnProperty(cleansed)) {
                mapObj[cleansed] = {};
                if (isToken(comp)) {
                    mapObj[PARAM_DEFAULT_ROUTE] = cleansed;
                }
            }
            buildMap(mapObj[cleansed], components, index, ref);

        }
    };

    /**
     * The method goes through each component andd cleanses the components
     * of the { and  : tokens
     * @param components
     * @return: An array of components cleansed of any tokens
     */
    var cleanseComponents = function (components) {
        var cleansed = [];
        var component;
        for (var index in components) {
            component = components[index];//removeTokens(components[index]);

            //Ignore any empty components
            if (component != '') {
                cleansed.push(component);
            }

        }
        return cleansed;
    };

    var isToken = function (component) {
        var tokens = ['{', ':'];

        for (var index in tokens) {
            if (component.indexOf(tokens[index]) >= 0) {
                return true;
            }
        }

        return false;
    };

    var removeTokens = function (component) {
        var tokens = ['{', '}', ':'];
        var cleansed = component;
        for (var index in tokens) {
            cleansed = cleansed.replace(tokens[index], '');
        }
        return cleansed;
    };

    /**
     * The function returns the default route for a given level of the route map
     * @param obj The current level
     * @returns The default route for that level if one is found,else null
     */
    var getDefaultRoute = function (obj) {
        var def;

        if (obj.hasOwnProperty(PARAM_DEFAULT_ROUTE)) {
            def = obj[PARAM_DEFAULT_ROUTE];
            return obj[def];
        }
        return null;
    };

    var getDefaultRouteName = function (obj) {
        var def;

        if (obj.hasOwnProperty(PARAM_DEFAULT_ROUTE)) {
            return removeTokens(obj[PARAM_DEFAULT_ROUTE]);
        }

        return '';
    }

    /**
     * The method is used to return the reference to the data or function
     * pointed to by a given route.It accesses the _ref property stored with the route
     * @param obj An object representing the final level of the route
     * @returns If a reference is found then it is returned (an object or function),else null
     */
    var getRef = function (obj) {
        if (obj.hasOwnProperty(PARAM_REF)) {
            return obj[PARAM_REF];
        }
        return null;
    }

    RouteMap = Routes;
    LayerStack = Stack;

}());