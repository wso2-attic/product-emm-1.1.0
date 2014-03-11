/*
 Description: The following class is used to validate all mandatory fields
 Filename: mandatory.field.validator.js
 Created Date: 10/10/2013
 */
var validatorModule = function () {
     var log=new Log('mandatory.field.validator');

    /*
     The function is used to check if the context can be handled by the
     validator
     @context: The context of the validation request
     @return: True if the validator is handled,else false
     */
    function isApplicable(context) {
        var model = context.model;
        var template = context.template;

        //Check if the template and model are given
        if ((template) && (model)) {
            return true;
        }

        return false;
    }

    /*
     The function is used to check for mandatory fields and check if they have been filled
     */
    function execute(context) {

        var template = context.template;
        var model = context.model;
        var report=context.report;
		
		
        //Go through each field and check if it is mandatory
        for (var index in template.tables) {

            handleTable(template.tables[index],model,report);

        }

        return true;
    }

    /*
     The function traverses each field in the provided table
     @table: An extension template table instance
     @model: The model object that is been inspected
     @report: The report on the validation
     */
    function handleTable(table,model,report) {
        var field;
        for (var fieldIndex in table.fields) {


            field = table.fields[fieldIndex];

            handleField(field,table.name,model,report);

        }
    }

    /*
     The function checks if the provided field is mandatory,if it is the value of the field is checked.
     @field: A field object to be inspected
     @tableName: The name of the table to which the field belongs
     @model: A model object holding the field
     @report: The report on the validation
     */
    function handleField(field, tableName, model, report) {
    	
    	//log.info('field inspected: '+field.name+' value= '+field.value);
    	
        var isRequired = field.required || false;

        //Check if the field is required
        if (isRequired) {


            //Get the value of the field from the model
            var fieldInstance = model.get(tableName + '.' + field.name);
            
            //log.info(fieldInstance);

            if(!fieldInstance){
                report.record(field.name,'Mandatory field '+field.name+' is not present.');
                return;
            }

            var value=fieldInstance.value;
            value=value.trim();
            value=value.replace("undefined","");

            if (value == '') {

                report.record(field.name,'Mandatory field '+field.name+' has  not been filled in.');
            }
        }
    }

    return{
        isApplicable: isApplicable,
        execute: execute
    }
}
