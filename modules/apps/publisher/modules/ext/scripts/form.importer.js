var meta = {
    use: 'import',
    type: 'form.importer',
    required: ['model', 'template', 'inputData']
};

/*
 Description: Reads data from an array obtained from a POST request  and stores it in the model
 Filename:form.importer.js
 Created Dated: 11/8/2013
 */
var module = function () {

    var log = new Log();

    function fillFields(model, data, template) {

        var fieldData;
        var tableKey;
        var fieldKey;

        //Go through each key
        for (var key in data) {

            //break up the key
            var field = key.replace('_', '.');
            log.debug('Saving field: ' + field);

            //Get the table name and field name if they exist
            var nameComponents = field.split('.');
            tableKey = nameComponents[0] || null;
            fieldKey = nameComponents[1] || null;

            //Obtain the field data to set default values
            if ((tableKey) && (fieldKey)) {
                //Get the field data
                fieldData = template.getField(tableKey, fieldKey);
            }

            var fieldValue = data[key];
            if ((!data[key]) && (fieldData)) {
                log.debug('* ' + fieldData.value);
                fieldValue = fieldData.value || ' ';

            }

            model.setField(field, fieldValue);
        }
    }


    return{
        execute: function (context) {

            log.debug('Entered :' + meta.type);
            var data = context.inputData;
            var model = context.model;
            var template = context.template;

            log.debug('Attempting import data from' + stringify(data));

            fillFields(model, data, template);

            log.debug('Finished importing data from form');
            log.debug('Exited : ' + meta.type);
        }
    }
};