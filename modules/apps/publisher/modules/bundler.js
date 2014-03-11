/*
 Description: Handles the management of folders (bundles) containing the details of assets.
 Filename:  bundler.js
 Created Date:13/8/2013
 */

var utility = require('/modules/utility.js').rxt_utility();

var bundle_logic = function () {
    var log = new Log();

    /*
     The supported extensions
     */
    var FILE_TYPES = {
        "Image": "Image"
    };

    /*
     The class is used to store meta information of a directory or a file
     */
    function Bundle(options) {
        this.path = '';
        this.name = '';
        this.extension = '';
        this.type = '';
        this.isDirectory = false;
        this.instance = null;

        utility.config(options, this);

        //A resource can have many resources inside it
        this.children = [];
    }

    /*
     The function adds a child resource to the bundle
     @resource: A file or another directory
     */
    Bundle.prototype.add = function (resource) {
        this.children.push(resource);
    };

    /*
     The class allows a generic way of manipulating bundles
     regardless of whether it is a directory or file
     */
    function BundleContainer(options) {
        this.bundle = null;
        this.queryBundles = [];
        utility.config(options, this);

    }

    /*
     The function checks if the bundle has any children
     @return: True if child bundles are present,else False
     */
    BundleContainer.prototype.hasChildren = function () {
        return (this.bundle.children.length > 0);
    };

    /*
     The function returns the name of the bundle
     @return: A string representing the name of the bundle
     */
    BundleContainer.prototype.getName = function () {
        return this.bundle.name;
    };

    /*
     The function checks whether the current bundle is a directory
     @return:True if the bundle is a directory,else False
     */
    BundleContainer.prototype.isDirectory = function () {
        return this.bundle.isDirectory;
    };

    /*
     The function returns the extension of the bundle if it is a file
     @return: A string representing the extension of the bundle,if it is not a file an empty string is returned
     */
    BundleContainer.prototype.getExtension = function () {
        return this.bundle.extension;
    }

    /*
     The function returns the contents of the bundle.If it is a file then the contents are returned
     TODO: Add logic to handle attempts to call read when the bundle is a directory
     @return: A string representing the contents of the bundle read using a file reference
     */
    BundleContainer.prototype.getContents = function () {
        var content = '';
        if (this.bundle.instance) {
            this.bundle.instance.open('r');
            content = this.bundle.instance.readAll();
            this.bundle.instance.close();
            return content;
        }

        return '';
    }

    /*
     The function returns a String representation of a bundle
     @return: A String representing bundle information
     */
    BundleContainer.prototype.toString = function () {
        return 'bundle enclosed: ' + this.bundle.name + ' children: ' + this.bundle.children.length;
    }

    /*
     The function is used to search child bundles for a match to the predicate
     @predicate: A function which accepts the currently interated bundle and returns True if a condition is met
     @return: A BundleContainer encapuslating the results of the query
     */
    BundleContainer.prototype.get = function (predicate) {
        var qContainer = new BundleContainer();

        log.debug('get called with : ' + stringify(predicate));
        log.debug('current bundle: ' + this.bundle.name);
        if (!this.bundle) {
            log.debug('cannot get when there is no bundle present.');
            return qContainer;
        }

        var bundlesFound = [];
        recursiveFind(this.bundle, predicate, bundlesFound);

        qContainer = new BundleContainer({
            queryBundles: bundlesFound
        });
        log.debug('get has found: ' + bundlesFound.length);
        return qContainer;
    };

    /*
     The function returns the first query result
     @return: The function returns the first bundle in the queryBundles array
     which is used to store results of a query
     */
    BundleContainer.prototype.result = function () {
        if ((this.queryBundles) && (this.queryBundles.length > 0)) {
            return new BundleContainer({bundle: this.queryBundles[0]});
        }

        return null;
    }

    /*
     The method allows iteration over each child bundle or
     each query result
     @iterator: A function call back which is invoked for each bundle
     */
    BundleContainer.prototype.each = function (iterator) {
        var tempBundle;

        //If the bundle container contains a reference to
        //a single bundle then iterate through the children
        if (this.bundle) {
            log.debug('Iterating child bundles');

            for (var index in this.bundle.children) {
                tempBundle = new BundleContainer({
                    bundle: this.bundle.children[index]
                });

                iterator(tempBundle);
            }
        }
        else {

            //Go through all the queried bundles
            for (var index in this.queryBundles) {
                tempBundle = new BundleContainer({
                    bundle: this.queryBundles[index]
                });

                iterator(tempBundle);
            }
        }

    };

    /*
     The function inspects the first result of a queryBundle.
     @iterator: A function which recieves the first query bundle as a parameter
     */
    BundleContainer.prototype.first = function (iterator) {
        log.debug('queried bundles ' + this.queryBundles.length);
        var queryBundleCount = (this.queryBundles) ? this.queryBundles.length : 0;

        //Check if there are any queryBundles
        if (queryBundleCount != 0) {

            var temp = new BundleContainer({
                bundle: this.queryBundles[0]});
            return iterator(temp);
        }
    };

    /*
     The class is used to manage bundles
     */
    function BundleManager(options) {
        this.rootBundle = null;
        this.path = '';
        utility.config(options, this);

        if (this.path != '') {
            this.rootBundle = recursiveBuild(new File(this.path));
        }
    }

    /*
     The function rreturns the root bundle
     @return: The function returns the very first bundle in the bundle tree
     */
    BundleManager.prototype.getRoot = function () {
        return new BundleContainer({bundle: this.rootBundle});
    };

    /*
     Allows a particular bundle to be queried.Only the first matching
     result is returned.
     @predicate: The predicate used in finding a match
     @return: A BundleContainer object containing the results of the query
     */
    BundleManager.prototype.get = function (predicate) {
        var result = [];
        var bundleContainer = new BundleContainer();

        //Locate the matching bundle using the predicate
        recursiveFind(this.rootBundle, predicate, result);


        //Get the first result
        if (result.length > 0) {
            bundleContainer = new BundleContainer({
                bundle: result[0]
            });
            return bundleContainer;
        }

        log.debug('A matching bundle was not found for query: ' + stringify(predicate));

        return bundleContainer;
    };

    /*
     The function finds a resource based on the provided criteria
     @root: The root to be searched
     */
    function recursiveFind(root, predicate, found) {

        //Check if the root is a leaf
        if (root.children.length == 0) {

            //Check if the current root is a match
            if (utility.isEqual(predicate, root)) {
                log.debug('Found a match as  leaf: ' + root.name);
                return root;
            }

            return null;
        }
        else {

            //Check if the directory will be a match
            if (utility.isEqual(predicate, root)) {
                log.debug('Found a match as a root: ' + root.name);
                return root;
            }

            var foundResource;
            var currentResource;

            //Go through each resource in the sub resources
            for (var index in root.children) {

                currentResource = root.children[index];

                foundResource = recursiveFind(currentResource, predicate, found);

                //Check if a resource was found.
                if (foundResource) {
                    log.debug('adding bundle: ' + foundResource.name);
                    found.push(foundResource);
                }
            }

            //return found;
        }
    }

    /*
     The function recursively builds the bundle structure based on a given file location
     @file: The root location of the bundles
     */
    function recursiveBuild(file) {

        //Check if it is a directory in order to identify whether it is a child
        if (!file.isDirectory()) {

            var resource = new Bundle({
                name: file.getName(),
                extension: utility.fileio.getExtension(file),
                instance: file
            });

            log.debug(file.getName() + ' not a directory ');

            return resource;
        }
        else {

            log.debug(file.getName() + ' will be a root bundle.');

            //Create a resource of root type
            var dir = new Bundle({
                isDirectory: true,
                name: file.getName(),
                instance: file
            });

            //Obtain the sub resources within the given directory
            var resources = file.listFiles();

            log.debug('resources found: ' + resources.length);

            //Go through each file
            for (var index in resources) {

                var current = recursiveBuild(resources[index], dir);
                log.debug('adding: ' + current.name + ' as a child resource of ' + dir.name);

                dir.add(current);
            }
            return dir;
        }
    }

    return{
        build: recursiveBuild,
        find: recursiveFind,
        Bundle: Bundle,
        BundleManager: BundleManager
    }
};



