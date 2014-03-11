/*
 Description: The injector is used to remove any display urls and write back the uuid/file name combination
 Filename:asset.display.injector.js
 Created Date: 27/9/2013
 */

var injector = function () {

    var log = new Log('asset.display.injector');
    var utility=require('/modules/utility.js').rxt_utility();
    var dataInjectModule = require('/modules/data/data.injector.js').dataInjectorModule();
    var modes = dataInjectModule.Modes;
    var config=require('/config/storage.json');
    var process=require('process');

    /*
    Constants
     */
    var FIELD_ELEMENT_LIMIT=2; //The minimum size of a url uuid/file
    var UUID_OFFSET=2;         //The location of the uuid
    var FILE_OFFSET=1;         //The locate of the file


    /*
     The modes in which the handler should be executed
     @return: The operation mode in which the handler should be executed
     */
    function operationModes() {
        return modes.UPDATE;
    }

    function init(context){
        context['config']=config;
    }

    /*
     The function checks whether the provided object should be processed by the
     the injector
     @object: The object to be checked for a match
     return: True if the object is handled,else false
     */
    function isHandled(object) {

        //We check for the exsistence of an attributes property
        if(object.hasOwnProperty('attributes')){
            return true;
        }

        log.debug('object'+stringify(object)+' is not handled');

        return false;
    }

    /*
     The function obtains a set of targeted fields and writes back
     a customized Url
     @context: The context data to handle a particular field
     @return: True, if handled successfully,else false
     */
    function handle(context) {

        var object=context.object||{};
        var config=context.config;
        var fields=config.storeFields;
        var url;
        var uuid;
        var field;

        //Go through all of the targeted fields
        for(var index in fields){

            utility.isPresent(object.attributes,fields[index],function(){

                //Current field been examined
                field=fields[index];

                //Extract the uuid/filename from a url and write them back to the asset.
                extractUUID(field,object);

            });
        }

        return true;
    }

    /*
    The function checks if the field is a url,if it is a url then the UUID and filename values are extracted.
    These extracted values are then written back to the field.
    @field: The field to be examined
    @asset: An artifact instance containing the field
    @throws: If the UUID is not valid then an exception is thrown.
     */
    function extractUUID(field,asset){
        var value;
        var comps;
        var uuid;
        var fileName;

        //Obtain the value
        value=asset.attributes[field];

        //Break up the value based on /
        comps=value.split('/');

        //Do nothing if the number of components is 2 or less
        if(comps.length<=FIELD_ELEMENT_LIMIT){
            log.debug('only uuid/file present');
           return;
        }

        //Get the last two values in the component array
        uuid=comps[comps.length-UUID_OFFSET];
        fileName=comps[comps.length-FILE_OFFSET];


        //Check if the uuid is valid
        if(!utility.isValidUuid(uuid)){
            log.debug('the uuid: '+uuid+' is not valid for field '+field);

            asset.attributes[field]=value;
            return;
            //throw 'Invalid UUID in storage field.'+field;
        }

        asset.attributes[field]=uuid+'/'+fileName;
    }

    return{
        init:init,
        operationModes: operationModes,
        isHandled: isHandled,
        handle: handle
    };
};

