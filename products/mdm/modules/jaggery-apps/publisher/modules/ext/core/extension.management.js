var ext_domain = require('extension.domain.js').extension_domain();
var utility = require('/modules/utility.js').rxt_utility();

/*
 Description: All operations on the rxt data are exposed through a proxy object.
 The proxy object is responsible for managing the data and invoking actions
 such as save and fetch operations.
 FileName:extension.management.js
 Created Date: 8/8/2013
 */

var extension_management = function () {

    var log = new Log();

    /*
     * A proxy which interacts with the user
     */
    function Model(options) {
        this.dataModel = new ext_domain.DataModel();
        this.adapterManager = null;
        this.template = null;	//The template of the data stored in the model
        this.actionManager = null;
        this.rxtManager = null;
        this.validationManager = null;
        utility.config(options, this);
        this.init();
    }

    /*
     * Preload the tables and fields in the template
     * to the data model
     */
    Model.prototype.init = function () {
        //Go through each table
        for each(var table
        in
        this.template.tables
        )
        {

            //Go through each field
            for each(var field
        in
            table.fields
        )
            {

                this.dataModel.setField(table.name + '.' + field.name, field.value);
            }
        }
    }

    /*
     Sets the field value
     @fieldName: The field  name in the form {table}.{field_name}
     @value: The value of the field
     */
    Model.prototype.set = function (fieldName, value) {
        this.dataModel.setField(fieldName, value);
    }

    /*
     Gets the field value
     @fieldName: the field in the form {table_name}.{field_name}
     @return:If the field is present then a field object is returned ,else null
     */
    Model.prototype.get = function (fieldName) {
        return this.dataModel.getField(fieldName);
    }

    /*
     Exports the model data to the provided type
     @type: The exporter type to use
     @returns: An object of the format outputed by the specified exporter
     */
    Model.prototype.export = function (type) {
        var adapter = this.adapterManager.find(type);
        log.debug('Invoking the exporter: ' + stringify(adapter));
        return adapter.execute({model: this.dataModel, template: this.template});
    }

    /*
     Imports the provided data into the model using the specified importer type
     @type: The type of importer to use
     @inputData: An object containing data that is to be imported into the model
     */
    Model.prototype.import = function (type, inputData) {
        var adapter = this.adapterManager.find(type);
        var context = this.getContext();
        context['inputData'] = inputData;
        log.debug('Invoking the importer: ' + stringify(adapter));
        adapter.execute(context);
    }

    /*
     Saves the data based on the save properties defined in the extension file
     */
    Model.prototype.save = function () {
        //Obtain the save action map for the template
        var saveActionMap = this.actionManager.getAction(this.template.name, 'save');

        //If there is no action map do nothing
        if (saveActionMap == null) {
            log.debug('No action map found for model type: ' + this.template.shortName);
            return;
        }

        log.debug('Action map found.Invoking the operation :save');

        this.invokeActionMap(saveActionMap, 'save');
    }

    /*
     The method is used to perform validation on a model object
     @return: An object containing fields that have failed validations along with the errors
     */
    Model.prototype.validate = function () {
        var result=this.validationManager.validate({model:this,template:this.template});
        return result;
    };

    /*
     The function invokes the actions in the provided action map
     @actionMap:
     @actionName: The name of the action to invoke
     */
    Model.prototype.invokeActionMap = function (actionMap, actionName) {

        //Process all the default actions
        var defaultAction = actionMap['default'];

        if (defaultAction != null) {

            //Obtain the handler
            var defaultHandler = this.adapterManager.findWith(function (adapter) {
                return ((adapter.meta.source == 'default') && (adapter.meta.purpose == actionName)) ? true : false;
            });


            if (defaultHandler != null) {
                log.debug('Executing default action : ' + actionName + ' for the operation: ' + actionName);
                log.debug('Handler ' + stringify(defaultHandler));
                defaultHandler.execute({template: this.template, model: this.dataModel, actionMap: defaultAction, parent: this, rxtManager: this.rxtManager});
            }

        }

        //Execute all non default actions
        for (var action in actionMap) {
            if (action != 'default') {


                var handler = this.adapterManager.findWith(function (adapter) {
                    return((adapter.meta.name == action) && (adapter.meta.purpose == actionName)) ? true : false;
                })

                if (handler != null) {
                    log.debug('Executing the action: ' + action + ' for operation: ' + actionName)
                    handler.execute({template: this.template, model: this.dataModel, actionMap: actionMap[action], parent: this, rxtManager: this.rxtManager});
                }
            }
        }

        log.debug('Finished invoking action map for operation: ' + actionName);
    }

    //TODO: Remove this method
    Model.prototype.getContext = function () {
        return {model: this.dataModel, template: this.template};
    }

    /*
     * The class is used to create models based on
     * predefined templates
     */
    function ModelManager(options) {
        this.parser = null;
        this.adapterManager = null;
        this.actionManager = null;
        this.rxtManager = null;
        this.validationManager = null;
        utility.config(options, this);
    }

    /*
     Creates a model of the specified type
     @type: The type of model to create
     @return: A model of the provided type, or null if it is not found
     */
    ModelManager.prototype.getModel = function (type) {
        //Obtain the template of the model from the parser
        for each(var template
        in
        this.parser.templates
        )
        {

            if (template.applyTo == type) {
                log.debug('A model for type: ' + type + 'has been created.');
                return new Model({template: template, adapterManager: this.adapterManager,
                    actionManager: this.actionManager, rxtManager: this.rxtManager, validationManager: this.validationManager});
            }
        }
        log.debug('The model type: ' + type + ' could not be found.')
        return null;
    }

    /*
     The function checks whether two models a and b are equal by inspecting for the presence of the provided required
     properties
     @a: The object to be inspected
     @b: The function will take the values of a and then compare them to the values of b
     @return: True if the two models are identical,else false.
     */
    ModelManager.prototype.assertEqual = function (a, b, reqProps) {
        var reqProps = reqProps || [];

        var fieldProp;
        var fieldA;
        var fieldB;
        var isEqual = true;

        //Go through each required property while the two objects are equal
        for (var index = 0; ((index < reqProps.length) && (isEqual)); index++) {

            //Get the property name
            fieldProp = reqProps[index];

            //Obtain the field instances
            fieldA = a.get(fieldProp);
            fieldB = b.get(fieldProp);

            //Check if the two fields are equal
            if (fieldA.getValue() != fieldB.getValue()) {
                isEqual = false;
            }
        }

        return isEqual;
    };

    /*
     The function determines the differences between two objects a and b based on the required properties
     @a: The object to be inspected
     @b: The function will take the values of a and then compare them to the values of b
     @reqProps: The properties that should be equal between the two models
     @return: The fields in the reqProps that are different
     */
    ModelManager.prototype.diff = function (a, b, reqProps) {
        var reqProps = reqProps || [];
        var difference = [];
        var fieldProp;
        var fieldA;
        var fieldB;

        for (var index in reqProps) {
            fieldProp = reqProps[index];

            fieldA = a.get(fieldProp);
            fieldB = b.get(fieldProp);

            log.debug('field A ' + fieldA.getValue() + ' field B: ' + fieldB.getValue());

            if (fieldA.getValue() != fieldB.getValue()) {
                difference.push(fieldProp);
            }
        }

        return difference;
    };

    return{
        ModelManager: ModelManager
    }

};