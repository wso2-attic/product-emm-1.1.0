var reflection = {};

/**
 * Description: The script encapsulates any reflection related utility functions
 */
(function () {

    var log = new Log('utils-reflection');

    reflection.copyPropKeys = function (from, to) {
        for (var key in from) {
            if (from.hasOwnProperty(key)) {
                to[key] = '';
            }
        }

        return to;
    };

    /**
     * The function recursively copies all property keys in an object
     * @param from
     * @param to
     */
    reflection.copyAllPropKeys = function (from, to) {
        recurse(from, to, function (from, to, key) {
            if (from[key]instanceof Object) {
                to[key] = from[key];
            }
            else {
                to[key] = null;
            }
        });
    };

    reflection.copyAllPropValues = function (from, to) {
        recurse(from, to, function (from, to, key) {

            //Create an instance if the property does not exist
            if (!to[key]) {
                to[key] = {};
            }

            //Copy the values over
            if (!(from[key]instanceof Object)) {
                to[key] = from[key];
            }
            else {
                log.debug('Not copying values of key: ' + key);
            }
        });
    };

    /**
     * The function will only copy public properties
     * @param from
     * @param to
     */
    reflection.copyPublicPropValues = function (from, to) {
        recurse(from, to, function (from, to, key) {
            //Ignore any hidden properties
            if (key.charAt(0) == '_') {
                log.warn('Drop key: ' + key);
                return;
            }

            //Create an instance if the property does not exist
            if (!to[key]) {
                to[key] = {};
            }

            //Copy the values over
            if (!(from[key]instanceof Object)) {
                to[key] = from[key];
            }
            else {
                log.warn('Not copying values of key: ' + key);
            }
        });
    };

    reflection.inspect = function (from, to, cb) {
        recurse(from, to, cb);
    };

    /**
     * The function recursively traverses an object and then invokes the provided
     * callback
     * @param root
     * @param clone
     * @param cb
     */
    var recurse = function (root, clone, cb) {
        var key;
        //Check if the root is an object
        if (!(root instanceof Object)) {
            return;
        }
        else {
            var keys = Object.keys(root);
            //Go through all the other keys in the current root
            for (var index in keys) {
                key = keys[index];
                cb(root, clone, key);
                recurse(root[key], clone[key], cb);
            }
        }
    };

    reflection.copyProps = function (from, to) {
        for (var key in from) {
            if (from.hasOwnProperty(key)) {
                to[key] = from[key];
            }
        }

        return to;
    };

    reflection.getProps = function (obj) {
        var props = {};

        for (var key in obj) {
            if (!(obj[key] instanceof  Function)) {
                props[key] = obj[key];
            }
        }

        return props;
    };


    reflection.printProps = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                log.info('key: ' + key);
            }
        }
    };

    /**
     * The function determines if a property is hidden based on _
     * @param key
     * @returns {boolean}
     */
    reflection.isHiddenProp = function (key) {
        if (key == '') {
            return false;
        }

        return (key.charAt(0) == '_') ? true : false;
    };

    var getDiff = function (a, b, diff) {

    };

    /**
     * The function calculates the differences between two simple JSON objects
     * @param a  The object with which b is compared
     * @param b  The target of the comparison
     * @return An object which records the differences between the two objects
     */
    reflection.diff = function (a, b) {

    };

}());

