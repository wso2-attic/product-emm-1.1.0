/*
 Description: The following class is used to translate a database query.
 Filename: query.provider.js
 Created Date: 16/10/2013
 */
var queryTranslator = function () {

    /*
     The function uses the schema and the modeManager to convert the results into
     model objects
     @schema: The schema of the table from which the results are obtained
     */
    function translate(schema, modelManager, results) {
        var result;
        var field;
        var models = [];
        var model;
        for (var index in results) {

            result = results[index];
            model = modelManager.get(schema.name);

            for (var prop in result) {

                for (var key in schema.fields) {

                    field = schema.fields[key];


                    if (field.name.toUpperCase() == prop) {

                        model[field.name] = result[prop];
                    }
                }
            }

            models.push(model);

        }

        return models;
    }

    return {
        translate: translate
    }
};
