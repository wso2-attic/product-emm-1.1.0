/*
Description: The script is used to check for the existence of a file path in a given set of properties
             and to load and store these files in the Storage Manager.
Filename:asset.storage.injector.js
Created Date: 27/9/2013
 */

var injector=function(){

    var log=new Log('asset.storage.injector');
    var utility=require('/modules/utility.js').rxt_utility();
    var dataInjectModule=require('/modules/data/data.injector.js').dataInjectorModule();
    var modes=dataInjectModule.Modes;
    var config=require('/config/storage.json');

    /*
    The function performs any initialization logic.It is invoked only once when the handler is assembled
    @context: The context which will be used in handling requests
     */
    function init(context){
          context['config']=config;
    }

    /*
     The modes in which the handler should be executed
     @return: The operation mode in which the handler should be executed
     */
    function operationModes(){
       return modes.STORAGE;
    }

    /*
    The function checks whether the provided object should be processed by the
    the injector
    @object: The object to be checked for a match
    return: True if the object is handled,else false
     */
    function isHandled(object){

        //We check for the exsistence of an attributes property
        if(object.hasOwnProperty('attributes')){
            return true;
        }

        log.debug('the object: '+stringify(object)+' is not handled.');
    }

    /*
    The function extracts a set of targeted properties, if they contain a
    local file path it is added to the storage
    @context: The context data to handle a particular field
    @return: True, if handled successfully,else false
     */
    function handle(context){
        var object=context.object||{};
        var config=context.config;
        var fields=config.storeFields;
        var field;
        var uuid;
        var path;


        for(var index in fields){

            //Current field been examined
            field=fields[index];

            //log.debug(field);

            utility.isPresent(object.attributes,field,function(){

                //Get the value of the current field
                path=object.attributes[field];

                //Attempt to store
                uuid=addToStorage(path,context);

                //Update value
                if(uuid){
                    object.attributes[field]=uuid;
                }
            });
        }

        //log.debug(object);

        return true;
    }
    /*
    The function attempts to add the provided path to the storage if it is present
    and returns a uuid
    @path: A path to a resource
    @return: If the file is added to storage then a uuid is returned,else null
     */
    function addToStorage(path,context){
        var file=new File(path);
        var uuid=null;
        //log.debug('examining path: '+path);
        //Only add it storage if it is a valid path and get the uuid
        if(file.isExists()){
            log.debug('loaded resource '+path+' into storage.');
            uuid=useStorageManager(path,file,context);
        }

        return uuid
    }

    function useStorageManager(path,file,context){

        var path=path;

        //Only store it if the storage manager exists
        if(context.storageManager){

            var resource={};
            resource['file']=file;
            resource['contentType']=determineContentType(file);

            //Get the uuid/filename
            path=context.storageManager.put(resource);

        }

        return path;
    }

    function determineContentType(file){
        var extension=utility.fileio.getExtension(file);
        return utility.fileio.getContentType(extension);
    }


    return{
        init:init,
        operationModes:operationModes,
        isHandled:isHandled,
        handle:handle
    };
};
