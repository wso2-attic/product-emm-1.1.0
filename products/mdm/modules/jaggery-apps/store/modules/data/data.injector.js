/*
 Description: The class is used to inject values or transform data of objects
 Created Date:
 */

var dataInjectorModule = function () {

    var log = new Log('data.injector');
    var utility = require('/modules/utility.js').rxt_utility();
    var bundler = require('/modules/bundler.js').bundle_logic();


    var INJECTOR_MODULE_NAME = 'injector';
    var INJECTOR_LOCATION = '/modules/data/injectors';

    var DATA_INJECTOR_CACHED='dataInjector';

    var INJECTOR_MODES = {
        'DEFAULT': 1,
        'INIT': 2,
        'STORAGE': 3,
        'DISPLAY': 4
    };


    function DataInjector() {
        //The list of injectors to be used
        this.injectors = {};
        this.injectors[INJECTOR_MODES.INIT] = [];
        this.injectors[INJECTOR_MODES.STORAGE] = [];
        this.injectors[INJECTOR_MODES.DISPLAY] = [];
        this.injectors[INJECTOR_MODES.DEFAULT]=[];
        this.globals={};

        this.buildInjector();
    }



    DataInjector.prototype.addToContext=function(key,obj){
        this.globals[key]=obj;
    };

    /*
     The function is used to inject some values into an object
     @object:
     @mode: The mode in which the injection should happen
     */
    DataInjector.prototype.inject = function (object, mode) {

        var mode=mode||INJECTOR_MODES.DEFAULT;

        //Skip the injection step as the default mode will not do anything
        if(mode==INJECTOR_MODES.DEFAULT){
            log.debug('The default mode does nothing :p .Specify an injector mode!');
            return;
        }

        //Check if the object is a single object or an array
        if (object instanceof Array) {

            //Go through each element in the array
            for (var index in object) {
                this.handle(object[index], mode);
            }
        }
        else {

            this.handle(object,mode);
        }
    };

    /*
     The function dynamically assembles the DataInjector
     */
    DataInjector.prototype.buildInjector = function () {

        var bundleManager = new bundler.BundleManager({path: INJECTOR_LOCATION});

        var rootBundle = bundleManager.getRoot();
        var that = this;

        //Go through each bundle in root
        rootBundle.each(function (bundle) {

            //Only check for javascript files
            if (bundle.getExtension() != 'js') {
                return;
            }

            //Get the name of the bundle without the extension
            var fullName = bundle.getName().replace(bundle.getExtension(), '');

            //Load the script
            log.debug('loading script: '+INJECTOR_LOCATION + '/' + bundle.getName());

            var file = require(INJECTOR_LOCATION + '/' + bundle.getName())[INJECTOR_MODULE_NAME]();
            //file.injector();
            //Get the mode in which the handler operates
            var mode=file.operationModes();

            var context={};

            file.init(context);

            //Register the injector and the created context
            that.injectors[mode].push({handler:file,context:context});
        });
    };

    /*
     The function is used to handle a single object
     @object: The object to be handled
     */
    DataInjector.prototype.handle = function (object,mode,options) {
        var result;
        var context;
        var options=options||{};
        var injectorArray=this.injectors[mode];

        //Pass through all of the injectors
        for (var index in injectorArray) {

            //Check if the object is handled by the injector
            if (injectorArray[index].handler.isHandled(object)) {


                //Obtain the context used by the handlers
                context=injectorArray[index].context;

                context['object']=object;

                //Add the options to the context
                utility.mergeProperties(context,options);
                utility.mergeProperties(context,this.globals);

                //Perform the handling logic
                result = injectorArray[index].handler.handle(context);

                //Check if handling logic should halt
                if (!result) {
                    log.debug('failed to execute injector on object: ' + stringify(object));
                    return;
                }
            }
        }
    };

    /*
    The function returns a cached copy of the DataInjector
    @return: A cached copy of the data injector
     */
    function getCached(){
        var instance=application.get(DATA_INJECTOR_CACHED);

        //Check if the data injector is cached
        if(!instance){

            instance=new DataInjector();
            application.put(DATA_INJECTOR_CACHED,instance);

        }

        return instance;
    }

    return{
        DataInjector: DataInjector,
        Modes:INJECTOR_MODES,
        cached:getCached
    };
};
