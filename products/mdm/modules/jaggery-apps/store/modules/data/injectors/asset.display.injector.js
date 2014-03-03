/*
 Description: The data injector is used to convert a uuid to a link specific to an app using the injector
 E.g. uuid: 78-2383933/apple.png
 In the publisher it will made available as publisher/storage/uuid/app.png
 In the store it will be made available as store/storage/uuid/app.png
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
     The modes in which the handler should be executed
     @return: The operation mode in which the handler should be executed
     */
    function operationModes() {
        return modes.DISPLAY;
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

                //Obtain the uuid
                url=object.attributes[field];

                uuid=getUUID(url);

                //Check if it is a valid uuid and create a new url
                if((uuid)&&(utility.isValidUuid(uuid))){
                    log.debug('creating a new url for '+url);
                    object.attributes[field]=getUrl(url,config,object);
                }

            });
        }

        //log.debug(object);

        return true;
    }

    /*
    The function obtains the UUID from a value
    @value: A string containing a UUID
    @return: A UUID if one is present else null
     */
    function getUUID(value){

        //Check if the uuid is present as uuid/file
        var components=value.split('/');
        var uuid=null;

        //A single value,could be a uuid
        if(components.length==1){
            uuid=components[0];
        }
        //Not a uuid/file value
        else if(components.length>1){
            uuid=components[0];
        }

        return uuid;

    }

    /*
    The function builds a url based on the provided pattern
    @uuid: The uuid of the resource to which the url should point
    @config: The config object used to store the context
    @object: The object containing an id
    @return: A url for the provided uuid for the current context
     */
    function getUrl(uuid,config,object){

        var context=config.context;
        var storageUrlPattern=config.storageUrlPattern;
        var ip=process.getProperty('server.host');
        var https=process.getProperty('https.port');
        var http=process.getProperty('http.port');

        storageUrlPattern=storageUrlPattern.replace('{ip}',ip);

        storageUrlPattern=storageUrlPattern.replace('{http}',http);
        storageUrlPattern=storageUrlPattern.replace('{https}',https);

        storageUrlPattern=storageUrlPattern.replace('{context}',context);
        storageUrlPattern=storageUrlPattern.replace('{uuid}',uuid);
        storageUrlPattern=storageUrlPattern.replace('{id}',object.id);
        storageUrlPattern=storageUrlPattern.replace('{type}',object.type);

        log.debug('new url: '+storageUrlPattern);
        return storageUrlPattern;
    }


    return{
        init:init,
        operationModes: operationModes,
        isHandled: isHandled,
        handle: handle
    };
};

