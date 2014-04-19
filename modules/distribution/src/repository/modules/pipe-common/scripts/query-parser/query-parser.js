/**
 * Description: The script is used to populate the query parameters into
 * a JSON object that is accessible to other plug-ins through req._query
 * Filename: query-parser.js
 */
function hasOwnProperty(obj, element) {
    return Object.prototype.hasOwnProperty.call(obj, element);
}

function isObject(object){
    return typeof object === 'object';   
}

/*
* ECMA Standard (ECMA-262 : 5.1 Edition)*/
function decodes(encodedURI) {
    return decodeURIComponent(encodedURI);
};

/*Serializes an object containing name:value pairs into a query string:
 @param  separator separator of URIComponent                  [optional, default - &]
 @param  assigner  assigner of key value pairURI Component    [optional, default - =]
 @param opt - above options must be provided with opt object
 */

var queryParser = function (option) {

    var obj = {};

    var handle = function (req, res, session, handlers) {

        var queryString = req.getQueryString(),
            opt = {};
            
        if(isObject(option)) {
            opt = option;
        }     

        if (queryString) {

            var sep = opt.sep || '&',
                assign = opt.assign || '=',
                compoArray = [];
            
            var decodedURI = decodes(queryString);

            decodedURI.split(sep).forEach(function(comp) {
                
                comp.split(assign).some(function(element, index, array) {
                    
                    if(hasOwnProperty(obj, element.toString())) {
                        compoArray.push(obj[element]);
                        compoArray.push(array[1]);

                        obj[element] = compoArray;
                    } else {
                        Object.defineProperty(obj, element, {
                        enumerable:true,
                        writable:true,
                        value:array[1]
                        });
                    }
                    return true;
                });
             });
            req.query = obj;
        }

        handlers();
    };

    return {
        handle: handle
    }
};
