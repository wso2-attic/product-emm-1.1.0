/*
 Description: The file houses the utility logic
 Filename:utility.js
 Created Date: 28/7/2013
 */
var rxt_utility = function () {
    var log = new Log();
    /*
     The method is used to create a JSON object using
     an xml object.
     @xmlElement: An xml element object to be processed
     @return: A pseudo object containing the properties of the
     xml element.
     */
    function createJSONObject(xmlElement) {

        var pseudo = {};

        //Extract all attributes
        var attributes = xmlElement.@*;

        //Fill the pseudo object with the attributes of the element
        for (var attributeKey in attributes) {
            var attribute = attributes[attributeKey];
            pseudo[attribute.localName()] = attribute.toString();
        }

        return pseudo;
    }


    /*
     The function converts an E4X Xml object to a JSON object
     This function has been adapted from the work of Oleg Podsechin available at
     https://gist.github.com/olegp/642667
     It uses a slightly modified version of his algorithm , therefore
     all credit should be attributed to Oleg Podsechin.
     IMPORTANT:
     1. It does not create a 1..1 mapping due to the differences
     between Xml and JSON.It is IMPORTANT that you verify the structure
     of the object generated before using it.
     2. The input xml object must not contain the xml header information
     This is a known bug 336551 (Mozilla Developer Network)
     Source: https://developer.mozilla.org/en/docs/E4X
     Please remove the header prior to sending the xml object for processing.
     @root: A starting element in an E4X Xml object
     @return: A JSON object mirroring the provided Xml object
     */
    function recursiveConvertE4XtoJSON(root) {

        log.debug('Root: ' + root.localName());

        //Obtain child nodes
        var children = root.*;

        //The number of children
        var numChildren = children.length();

        //No children
        if (numChildren == 0) {

            //Extract contents
            return createJSONObject(root);
        }
        else {

            //Create an empty object
            var rootObject = createJSONObject(root);

            //Could be multiple children
            for (var childElementKey in children) {

                var child = children[childElementKey];

                log.debug('Examining child: ' + child.localName());

                //If the child just contains a single value then stop
                if (child.localName() == undefined) {

                    log.debug('Child is undefined: ' + child.toString());

                    //Change the object to just a key value pair
                    rootObject[root.localName()] = child.toString();
                    return rootObject;
                }

                //Make a recursive call to construct the child element
                var createdObject = recursiveConvertE4XtoJSON(child);

                log.debug('Converted object: ' + stringify(createdObject));

                //Check if the root object has the property
                if (rootObject.hasOwnProperty(child.localName())) {

                    log.debug('key: ' + child.localName() + ' already present.');
                    rootObject[child.localName()].push(createdObject);
                }
                else {

                    log.debug('key: ' + child.localName() + ' not present.');
                    rootObject[child.localName()] = [];
                    rootObject[child.localName()].push(createdObject);

                }
            }

            log.debug('root: ' + root.localName());

            return rootObject;
        }
    }

    /*
     The function checks if a and b are equal for the property key.
     If a is an array then b's key is checked against the array to see if there is a match
     @a: The object to match against
     @b: The target of the check
     @return: True if a and b are equal
     */
    function checkEquality(a, b, key) {
        if (a[key] instanceof  Array) {

            return (a[key].indexOf(b[key]) != -1) ? true : false;
        }
        else {
            return a[key] == b[key];
        }
    }

    /*
     The function checks if a and b are equal for the property key.
     If a is an array then b's key is checked against the array to see if there is a match
     @a: The object to match against
     @b: The target of the check
     @return: True if a and b are equal
     */
    function checkEqualityCaseSensitive(a, b, key) {
        if (a[key] instanceof  Array) {

            return (a[key].indexOf(b[key]) != -1) ? true : false;
        }
        else {
            return a[key].toLowerCase() == b[key].toLowerCase();
        }
    }

    /*
     The function asserts whether the two provided objects are equal.
     @target: The target to be checked
     @predicateObj: An object containing properties to be checked
     @return: True if the target values match the predicate object
     */
    function assert(target, predicateObj) {

        //The function counts the number of properties in an object
        function countProps(obj) {
            var count = 0;
            for (var index in obj) {
                count++;
            }
            return count;
        }


        //The function recursively matches properties between the two
        //objects
        function recursiveInspect(target, obj, isEqual) {

            //Check if the object is empty
            if (countProps(obj) == 0) {
                //log.debug('empty object');
                return true;
            }
            else {

                //Go through each property
                for (var key in obj) {

                    //Check if the target's property is a predicate
                    if (target.hasOwnProperty(key)) {

                        //Check if it is an object
                        if (countProps(target[key]) > 0) {

                            isEqual = recursiveInspect(target[key], obj[key]);
                        }
                        else {
                            //isEqual=(obj[key]==target[key]);
                            isEqual = checkEquality(obj, target, key);
                        }
                    }
                    else {

                        //If the target does not have the property then it cannot be equal
                        return false;
                    }

                    //Check if the object is not equal
                    if (!isEqual) {
                        return false;
                    }
                }

                return true;
            }
        }

        return recursiveInspect(target, predicateObj, true);
    }

    /*
     The function asserts whether the two provided objects are equal.
     @target: The target to be checked
     @predicateObj: An object containing properties to be checked
     @return: True if the target values match the predicate object
     */
    function assertCaseSensitive(target, predicateObj) {

        //The function counts the number of properties in an object
        function countProps(obj) {
            var count = 0;
            for (var index in obj) {
                count++;
            }
            return count;
        }


        //The function recursively matches properties between the two
        //objects
        function recursiveInspect(target, obj, isEqual) {

            //Check if the object is empty
            if (countProps(obj) == 0) {
                //log.debug('empty object');
                return true;
            }
            else {

                //Go through each property
                for (var key in obj) {

                    //Check if the target's property is a predicate
                    if (target.hasOwnProperty(key)) {

                        //Check if it is an object
                        if (countProps(target[key]) > 0) {

                            isEqual = recursiveInspect(target[key], obj[key]);
                        }
                        else {
                            //isEqual=(obj[key]==target[key]);
                            isEqual = checkEqualityCaseSensitive(obj, target, key);
                        }
                    }
                    else {

                        //If the target does not have the property then it cannot be equal
                        return false;
                    }

                    //Check if the object is not equal
                    if (!isEqual) {
                        return false;
                    }
                }

                return true;
            }
        }

        return recursiveInspect(target, predicateObj, true);
    }

    return{
        /*The function takes a set of options
         and configures a target object
         @options: A set of options to configure the target
         @targ: The object to be configured
         */
        config: function (options, targ) {


            //Avoid if no options given or the
            //target is undefined
            if ((!options) || (!targ)) {
                return targ;
            }

            //Go through each field in the target object
            for (var key in targ) {

                //Avoid processing functions
                if (typeof targ[key] != 'function') {

                    var value = options[key];

                    //If a value is present
                    //do the configuration
                    if (value) {
                        targ[key] = value;
                    }
                }
            }
        },

        findInArray: function (array, fn) {
            for each(var item
            in
            array
            )
            {
                if (fn(item)) {
                    return item;
                }
            }

            return null;
        },
        /*
         The function iterates through each element in the array
         @array: The array to be iterated
         @fn: A function which will recieve each item in the array
         */
        each: function (array, fn) {
            for (var index in array) {
                fn(array[index], index);
            }
        },
        /*
         The function locates an item in the provided array
         based on the predicate function
         @array: The array to be searched
         @fn: A predicate function which returns when there is a match,else false
         */
        find: function (array, fn) {
            for (var index in array) {
                if (fn(array[index])) {
                    return array[index];
                }
            }

            return null;
        },

        /*
         The function executes the logic if a particular key is present
         in an object
         @object: The object to be checked
         @key: The property to be checked
         @logic:The logic to be executed
         */
        isPresent: function (object, key, logic) {
            //Check if the object has a property called key
            if (object.hasOwnProperty(key)) {
                logic(object[key]);
            }
        },

        /*
         The function copies the properties defined in the array from object A to B
         @objectA: The object to be targeted
         @objectB: The object which will recieve the values of A
         @propArray: An array of properties which occur in objectA

         */
        copyProperties: function (objectA, objectB, propArray) {
            for (var index in propArray) {
                var prop = propArray[index];
                objectB[prop] = objectA[prop];
            }
        },

        /*
         The function merges the properties in objectB to objectA
         @objectA: The object to merged against
         @objectB: The object whose values will be merged with A
         @return: An object containing the properties of both A and B
         */
        mergeProperties: function (objectA, objectB) {
            //Go through the properties in B
            for (var key in objectB) {

                objectA[key] = objectB[key];
            }
        },

        /*
         The function extends the functions of the parent with methods of the child
         @parent: The object to be extended
         @child: The object with which the child is extended
         */
        extend: function (parent, child) {

            //Go through method of the child
            for (var key in child) {

                //Check if the parent has the key
                if (parent.hasOwnProperty(key)) {
                    parent[key] = child[key];
                }
            }
        },
        /*
         The function checks whether two objects are equal
         @objectA: The target to be matched
         @equalizer:[OPTIONAL] Performs some value conversion on the object B value before comparison
         @return: True if the objects are similar,else false
         */
        isEqual: function (objectA, objectB, ignoredProperties, equalizer) {

            //If ignored properties are not provided
            ignoredProperties = ignoredProperties || [];

            equalizer = equalizer || function (value) {
                return value;
            };

            //There is no match
            var match = true;

            //Go through each property in object A.
            for (var propertyA in objectA) {

                //Check if object B has the property A.
                if ((objectB.hasOwnProperty(propertyA)) && (ignoredProperties.indexOf(propertyA) == -1)) {

                    //Check if the user has provided a list of criteria to search for
                    var isArray = objectA[propertyA] instanceof Array;

                    //Check if any of the array contents are present in object B
                    if (isArray) {
                        match = (objectA[propertyA].indexOf(equalizer(objectB[propertyA])) != -1);
                    }
                    else {
                        match = objectA[propertyA] == equalizer(objectB[propertyA]);
                    }

                    if (!match) {
                        return match;
                    }
                }
            }

            return match;
        },

        /*
         The function checks whether the provided url is a valid uuid
         @value: The value to be checked
         return: True if the value is a UUID else false
         */
        isValidUuid: function (value) {

            var rg = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

            var isMatch = value.match(rg);

            //Check if a match is returned
            if (isMatch) {
                return true;
            }

            return false;
        },

        /*
         The function checks for the presence of an object matching the predicate
         @array: An array of objects
         @predicate: A predicate condition
         */
        findInArray: function (array, predicate) {
            var tool;

            for (var index in array) {
                if (assert(array[index], predicate)) {
                    return array[index];
                }
            }

            return null;
        },
        /*
         The function asserts whether the two provided objects are equal.
         @target: The target to be checked
         @predicateObj: An object containing properties to be checked
         @return: True if the target values match the predicate object
         */
        assertEqual: function (target, predicateObj) {
            return assert(target, predicateObj);
        },

        assertEqualCaseSensitive:function(target,predicateObj){
            return assertCaseSensitive(target,predicateObj);
        },
        /*
         The function clones the provided object to a new one while
         optionally ignoring the provided properties
         @object:The object to be cloned
         @ignoredProperties: The properties to be ignored
         */
        cloneObject: function (object, ignoredProperties) {

            var ignore = ignoredProperties || [];

            var cloned = {};
            //Go through each property
            for (var index in object) {
                //Do not clone ignored properties
                if (ignore.indexOf(index) == -1) {
                    cloned[index] = object[index];
                }
            }

            return cloned;

        },

        /*
         The function converts an array into a csv list
         @array: An array of values
         @returns: A CSV string of the array
         */
        createCSVString: function (array) {

            //Send it back without processing if it is not an array
            if (!(array instanceof Array)) {
                return array;
            }

            var csv = '';
            var count = 0;
            var item = null;

            //Go through each element in the array
            for (var index in array) {
                item = array[index];
                if (count > 0) {
                    csv += ','
                }
                csv += item;
                count++;

            }

            return csv;
        },
        /*
         The function returns the values which occur in both a and b
         @a: An array of values
         @b: An array of values
         @return: An array containing objects which occcur both in a and b
         */
        intersect: function (a, b, compare) {

            var intersected = [];

            for (var indexA in a) {

                for (var indexB in b) {

                    //If a occurs in b add a
                    if (compare(a[indexA], b[indexB]) == true) {
                        intersected.push(a[indexA]);
                    }
                }
            }

            return intersected;
        },
        /*
         File related utility functions
         */
        fileio: {
            /*
             The function returns all files with a given extension
             in the provided path.
             NOTE: Hidden and temporary files are ignored
             @path: The path of the directory
             @returns: An array of files in the given path is returned
             */
            getFiles: function (path, extension) {
                //Replace . if the user sends it with the extension
                extension = extension.replace('.', '');

                var dir = new File(path);
                var files = [];
                if (dir.isDirectory) {

                    var list = dir.listFiles();

                    for (var index in list) {

                        var item = list[index];

                        //Extract the extension
                        var fileName = item.getName().split('.');
                        //The extension will always be the last element of a file name when it is split by .
                        var foundExt = fileName[fileName.length - 1];

                        if ((item.getName().indexOf('~') == -1) && (foundExt == extension)) {
                            files.push(item);
                        }
                    }
                }

                return files;
            },
            /*
             The function checks whether the provided file instance indicates a temporary file
             @file: A file instance
             @return: True if the provided file instance is of a temporary file
             */
            isTempFile: function (file) {
                return (file.getName().indexOf('~') != -1);
            },
            /*
             The function returns the extension of a file.
             @file: A file from which the extension must be extracted
             @return: The file extension as a string
             */
            getExtension: function (file) {
                var components = file.getName().split('.');

                if (components.length < 1) {
                    return '';
                }

                return components[components.length - 1];
            },
            /*
             The function returns the content type given the extension
             */
            getContentType: function (file) {
                var contentType = '';
                switch (file) {
                    case 'jpg':
                        contentType = 'image/jpg';
                        break;
                    case 'png':
                        contentType = 'image/png';
                        break;
                    case 'pdf':
                        contentType = 'application/pdf';
                        break;
                }

                return contentType;
            },
            /*
             The function returns all of the directories in a given path
             @path: The base path which must be inspected.
             @return: An array containing all directories in the provided path
             */
            getDir: function (path) {

                var file = new File(path);
                var resources = file.listFiles();
                var resource;
                var directories = [];

                //Go through all resources
                for (var index in resources) {

                    //Get the current resource
                    resource = resources[index];

                    //Check if the resource is a directory
                    if (resource.isDirectory()) {
                        directories.push(resource);
                    }
                }

                return directories;
            }
        },

        /*
         Xml related utility functions
         */
        xml: {

            convertE4XtoJSON: function (root) {
                return recursiveConvertE4XtoJSON(root);
            }
        }
    }
}
