(function (Handlebars) {

    var caramelData = 'X-Caramel-Data',
        resources = {
            js: {},
            css: {},
            code: {}
        };

    /**
     * {{#itr context}}key : {{key}} value : {{value}}{{/itr}}
     */
    Handlebars.registerHelper("itr", function (obj, options) {
        var key, buffer = '';
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                buffer += options.fn({key: key, value: obj[key]});
            }
        }
        return buffer;
    });

    /**
     * {{#func myFunction}}{{/func}}
     */
    Handlebars.registerHelper("func", function (context, block) {
        var param,
            args = [],
            params = block.hash;
        for (param in params) {
            if (params.hasOwnProperty(param)) {
                args.push(params[param]);
            }
        }
        return block(context.apply(null, args));
    });

    /**
     * Registers  'url' handler for resolving theme files.
     * {{url "js/jquery-lates.js"}}
     */
    Handlebars.registerHelper('url', function (path) {
        if (path.indexOf('http://') === 0 || path.indexOf('https://') === 0) {
            return path;
        }
        return caramel.url(path);
    });

    /**
     * Registers  't' handler for translating texts.
     * {{t "programming"}}
     */
    Handlebars.registerHelper('t', function (text) {
        return text;
    });

    /**
     * Registers  'json' handler for serializing objects.
     * {{json data}}
     */
    Handlebars.registerHelper('json', function (obj) {
        return obj ? new Handlebars.SafeString(JSON.stringify(obj)) : null;
    });

    /**
     * Registers  'cap' handler for resolving theme files.
     * {{url "js/jquery-lates.js"}}
     */
    Handlebars.registerHelper('cap', function (str) {
        return str.replace(/[^\s]+/g, function (str) {
            return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
        });
    });

    /**
     * {{#slice start="1" end="10" count="2" size="2"}}{{name}}{{/slice}}
     */
    Handlebars.registerHelper('slice', function (context, block) {
        var html = "",
            length = context.length,
            start = parseInt(block.hash.start, 10) || 0,
            end = parseInt(block.hash.end, 10) || length,
            count = parseInt(block.hash.count, 10) || length,
            size = parseInt(block.hash.size, 10) || length,
            i = start,
            c = 0;
        while (i < end && c++ < count) {
            html += block(context.slice(i, (i += size)));
        }
        return html;
    });

    /**
     * {{#t "text"}}{{/t}}
     */
    Handlebars.registerHelper('t', function (text) {
        return  new Handlebars.SafeString(text);
    });

    /*
     The snoop helper allows a query to be executed on objects stored inside
     an array.
     Usage: {{{snoop 'target(key=value).property' context}}}
     The target should be an array containing objects.
     The function works by recursively parsing a path expression
     */
    Handlebars.registerHelper('snoop', function (path, objectInstance) {


        /*
         Checks if the provided string is in the form of a query
         A query should be of the form (field=value)
         @str: The string expression that must be validated
         @return: True if the string is an expression.
         */
        function checkIfQuery(str) {
            return(((str.indexOf('(')) != -1) && (str.indexOf(')') != -1)) ? true : false;
        }


        /*
         The function travels recursively processing the object properties
         @loc: A path expression
         @object:The object in which the path occurs
         */
        function rec(loc, object) {

            //Determine if the path can be broken down
            var components = loc.split('.');

            //Stop traversal if the object is empty
            if (object == null) {
                return '';
            }
            else if (components.length == 1) {
                //Check if the current string is a key to the object
                return object[loc] || '';
            }
            else {

                /*Given a string path like: A(key=value).B.C
                 component[0]=A(key=value)
                 component[1]=B
                 component[2]=C
                 */

                //Get the starting point of A
                var currentStrIndex = loc.indexOf(components[0]);
                //Get the length of A
                var currentStrLength = components[0].length;
                //Extract just A from the string path A.B.C
                var currentStr = loc.substring(currentStrIndex, currentStrLength);

                //Remove A. so that the string is B.C
                var nextStr = loc.replace(currentStr + '.', '');

                //Get the property object[A] which should ideally return an object.
                //Note: This will evaluate to null if path is not found.e.g. The currentStr
                //is a query like A(key=value)
                var currentObj = object[currentStr];

                //Determine if the currentStr (e.g. A ) is a query
                if (checkIfQuery(components[0])) {

                    //Remove (   )
                    var indexStart = components[0].indexOf('(');
                    var indexEnd = components[0].indexOf(')');

                    //Extract the query expression (key=value)
                    var expression = components[0].substring(indexStart, indexEnd);

                    //Extract key
                    var operand = components[0].substring(0, indexStart);

                    //Get the object at property A
                    currentObj = object[operand];

                    //Get rid of the brackets in the (key=value)
                    var removed = expression.replace('(', '');
                    removed = removed.replace(')', '');

                    //Obtain the key and value pair
                    var kv = removed.split('=');

                    //If the key value pair is malformed we stop the search
                    if (kv.length == 0) {
                        return '';
                    }

                    //Obtain the value
                    var key = kv[0];
                    var value = kv[1];

                    var stop = false;

                    //Go through all items in the array(Assumption)
                    for (var index = 0; ((index < currentObj.length) && (!stop)); index++) {

                        //Check the property by the key
                        var item = currentObj[index];

                        //Compare the key to the value
                        if (item[key] == value) {

                            currentObj = item;
                            stop = true;	//Short circuit the search
                        }
                    }

                }

                return rec(nextStr, currentObj);

            }
        }

        return  rec(path, objectInstance);
    });

    /**
     *  Registers mergeContext handler which merge different contexts that needs to be passed in to a single partial.
     *
     * {{#mergeContext thisContext=this nameContext=../../name townContext=../town}}
     *      {{>child-partial}}
     * {{/mergeContext}}
     *
     * In the child-partial
     * {{nameContext.username}}
     *
     */
    Handlebars.registerHelper('mergeContext', function (options) {
        var context = {},
            mergeContext = function (obj) {
                for (var k in obj)context[k] = obj[k];
            };
        mergeContext(options.hash);
        return options.fn(context);
    });

    caramel.unloaded = {};

    caramel.data = function (areas, options) {
        var err = options.error,
            success = options.success,
            headers = options.headers || (options.headers = {});
        options.dataType = 'json';
        /*        options.success = function (data, status, xhr) {
         success(null, data);
         };
         options.error = function (xhr, status, error) {
         err({
         xhr: xhr,
         status: status,
         error: error
         });
         };*/
        headers[caramelData] = JSON.stringify(areas);
        $.ajax(options);
    };

    caramel.partials = function (partials, fn, force) {
        var partial,
            fns = [];
        for (partial in partials) {
            if (partials.hasOwnProperty(partial)) {
                if (!force && Handlebars.partials[partial]) {
                    continue;
                }
                fns.push(function (partial) {
                    return function (callback) {
                        caramel.get(partials[partial], function (data) {
                            Handlebars.partials[partial] = Handlebars.compile(data);
                            callback(null);
                        }, 'html');
                    };
                }(partial));
            }
        }
        async.parallel(fns, function (err, results) {
            fn(err);
        });
    };

    caramel.render = function (template, context, callback) {
        var partial, fns, html,
            fn = Handlebars.partials[template],
            unloaded = caramel.unloaded;
        if (fn) {
            html = fn(context);
        } else {
            unloaded[template] = true;
        }
        fns = [];
        for (partial in unloaded) {
            if (unloaded.hasOwnProperty(partial)) {
                fns.push(function (partial) {
                    return function (callback) {
                        delete caramel.unloaded[partial];
                        caramel.get('/themes/' + caramel.themer + '/partials/' + partial + '.hbs', function (data) {
                            Handlebars.partials[partial] = Handlebars.compile(data);
                            callback(null);
                        }, 'html');
                    };
                }(partial));
            }
        }
        if (fns.length === 0) {
            callback(null, html);
            return;
        }
        async.parallel(fns, function (err, results) {
            err ? callback(err) : caramel.render(template, context, callback);
        });
    };

    caramel.css = function (el, css, id) {
        var i, length;
        if (id && resources.css[id]) {
            return;
        } else {
            resources.css[id] = true;
        }
        if (css instanceof Array) {
            length = css.length;
            for (i = 0; i < length; i++) {
                el.append('<link rel="stylesheet" type="text/css" href="' + caramel.url(css[i]) + '"/>');
            }
        } else {
            el.append('<link rel="stylesheet" type="text/css" href="' + caramel.url(css) + '"/>');
        }
    };

    caramel.js = function (el, js, id, callback) {
        var i, counter, length;
        if (id && resources.js[id]) {
            callback();
            return;
        } else {
            resources.js[id] = true;
        }
        if (js instanceof Array) {
            length = js.length;
            counter = length;
            for (i = 0; i < length; i++) {
                $.getScript(caramel.url(js[i]), function () {
                    if (--counter > 0) {
                        return;
                    }
                    callback();
                });
            }
        } else {
            $.getScript(caramel.url(js), callback);
        }
    };

    caramel.code = function (el, code, id) {
        var i, length;
        if (id && resources.code[id]) {
            return;
        } else {
            resources.code[id] = true;
        }
        if (code instanceof Array) {
            length = code.length;
            for (i = 0; i < length; i++) {
                el.append(code[i]);
            }
        } else {
            el.append(code);
        }
    };

    caramel.loaded = function (type, name) {
        resources[type][name] = true;
    };

    var invoke = Handlebars.VM.invokePartial;

    Handlebars.VM.invokePartial = function (partial, name, context, helpers, partials, data) {
        var p = Handlebars.partials[name];
        if (p) {
            return invoke.apply(Handlebars.VM, Array.prototype.slice.call(arguments));
        }
        caramel.unloaded[name] = true;
        return '';
    };

}(Handlebars));