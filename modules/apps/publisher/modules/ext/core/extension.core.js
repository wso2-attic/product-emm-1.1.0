/*
Description: Core functionality of the extension mechanism
Filename:extension.core.js
Created:7/8/2013
 */

var utility = require('/modules/utility.js').rxt_utility();

var extension_core = function () {

    var log=new Log();

    /*
    Manages all of the external logic called adapters
     */
    function AdapterManager(options) {
        this.parser = {};
        this.adapters = [];
        utility.config(options, this);
    }

    /*
     * Loads all of the adapters by reading and requiring the import
     * array found in each template
     * TODO: The import should be locacalized for a template.At the moment
     * once an adapter is loaded it is available to all templates.
     */
    AdapterManager.prototype.init = function () {

        // Go through all of the imports and load all of the scripts
        for each(var template in this.parser.templates)
        {

            // Only process if there are imports
            if (template.import) {

                // Go through each import
                for each(var item
            in
                template.import
            )
                {
                    var instance = require(item);
                    log.debug('Loaded adapter: '+item);
                    this.adapters.push(new AdapterContainer(instance));
                }
            }
        }


    };

    /*
    The action manager is responsible for managing actions of templates
    Currently only;
        Save
     operations are supported.
     TODO: Make it more generic so other user defined actions can also be managed
     */
    function ActionManager(options){
        this.templates=[];
        this.actionContainers=[];
        utility.config(options,this);
    }

    /*
    The function goes through each template and creates an action container
    for each template
     */
    ActionManager.prototype.init=function(){
        var container=null;
        for each (var template in this.templates){

             //Each template has its own action container
             container=new ActionContainer({template:template});
             container.init();

            this.actionContainers.push(container);
        }
    };

    /*
    Locates the action map object for an action for a template
    @templateName: Name of a template for which the action must be located
    @actionName: The action to be located
    @returns: An action map object for the action,else null;
     */
    ActionManager.prototype.getAction=function(templateName,actionName){
        var action=null;

        //Find the appropriate action container
        var container=this.findContainer(templateName);

        if(!container){
            log.debug('The action: '+actionName+' was not found for template: '+templateName);
            return null;
        }

        //Obtain the appropriate action
        //TODO: Remove this switch -let the container handle it
        switch(actionName){
          case 'save':
               action=container.saveMap;
               break;
            case 'fetch':
               break;
          default:
               log.debug('The action: '+actionName+' is not supported for the template '+templateName);
               break;
         }

        return action;
    } ;

    /*
    The function locates an ActionContainer for a given template
     */
    ActionManager.prototype.findContainer=function(templateName){

        for each(var container in this.actionContainers){
                  if(container.template.name==templateName){
                      return container;
                  }
        }

        return null;
    } ;


    /*
    Stores the mapping of the actions on a template level
     */
    function ActionContainer(options){
        this.template=null;
        this.saveMap=null;
        this.fetchMap=null;
        utility.config(options,this);
    }

    /*
    Creates save and fetch action map objects for the template
     */
    ActionContainer.prototype.init=function(){
        this.saveMap=this.createActionMap('save',this.template);
        this.fetchMap=this.createActionMap('fetch',this.template);
    } ;


    /*
     Examines the template and creates a mapping of the actions based on meta fields
     */
    ActionContainer.prototype.createActionMap=function(action,template){
        log.debug('Processing action map for '+template.name+' operation: '+action);
        actionMap={};

        //Go through each field in the template and identify default save actions
        for each(var table in template.tables){

            //Go through each field
            for each(var field in table.fields){

                //Check if the field has meta properties
                if(field.meta){

                    //Locate the save property
                    var actionInstance=field.meta[action];

                    if(actionInstance){
                         log.debug('Action: '+actionInstance+' located for operation: '+action+' in field: '+field.name);

                        //Create a property if it is not already present
                        if(!actionMap[actionInstance]){
                            log.debug('Created a new action'+actionInstance+' for the operation '+action);
                            actionMap[actionInstance]=[];//Create an array to store the field
                        }

                        //Save to the map
                        actionMap[actionInstance].push(field);
                    }
                }
            }
        }
        log.debug('Finished processing action map for '+template.name+' operation: '+action);
        return actionMap;
    } ;


    /*
     Locates an adapter matching the required type
     @type: The type of the adapter
     @return: The adapter
     */
    AdapterManager.prototype.find = function (type) {

        for each(var adapter in this.adapters)
        {
            if (adapter.meta.type == type) {
                log.debug('An adapter container of type: '+type+' was located.');
                return adapter;
            }
        }
        log.debug('An adapter of type: '+type+' was not found.');
        return null;
    }  ;

    /*

     */
    AdapterManager.prototype.findWith=function(fn){
        for each(var adapter in this.adapters){
            if(fn(adapter)){
                log.debug('The adapter :'+stringify(adapter.meta)+' was located.');
                return adapter;
            }
        }
        log.debug('An adapter was not located.');
        return null;
    } ;

    /*
    The class is used to store the instance of the adapter along with its meta data
    @instance: An instance of the external script object module.
     */
    function AdapterContainer(instance) {
        this.meta = instance.meta;
        this.instance = instance.module();
    }

    /*
      Executes the logic of the adapter @context: The context within which the
      adapter must be executed
      @context: The set of data within which the adapter must be executed
     */
    AdapterContainer.prototype.execute = function (context) {
        return this.instance.execute(context);
    }  ;

    /*
    The class is used to manage fields
     */
    function FieldManager(options) {
        this.parser = null;
        utility.config(options, this);
    } ;

    /*
     The function processes all templates in the parser
     */
    FieldManager.prototype.init = function () {
        //Go through all of the templates
        for each(var template in this.parser.templates)
        {
            this.process(template);
        }
    };

    /*
      The function goes through each field in the provided template injects any
      fieldProperties
     */
    FieldManager.prototype.process = function (template) {

        // Go through each field properties
        for each(var fieldProperty in template.fieldProperties)
        {

            if (fieldProperty.field == '*') {
                //All the fields in all of the tables
                for each(var table in template.tables)
                {
                    addProperty(table, fieldProperty);
                }
            }
            else {
                var scope = fieldProperty.field.split('.');
                var table = scope[0];
                var field = scope[1];

                if (field == '*') {
                    //Find the specified table
                    var tableInstance = this.parser.getTable(table, template);

                    addProperty(tableInstance, fieldProperty);
                }
                else {
                    var fieldInstance = this.parser.getFieldFromTable(field, table, template);

                    addPropertyToField(fieldInstance, fieldProperty);
                }

            }
        }
    };


    /*
      Adds the provided property to the table
     */
    function addProperty(table, property) {
        for each(var field in table.fields)
        {
            addPropertyToField(field, property);
        }
    }

    /*
      Adds the provided property to the field
     */
    function addPropertyToField(field, property) {

        if (!field.meta) {
            field.meta = {};
        }

        field.meta[property.name] = property.value;
    }

    return{
        AdapterManager: AdapterManager,
        ActionManager:ActionManager,
        FieldManager: FieldManager
    }
}