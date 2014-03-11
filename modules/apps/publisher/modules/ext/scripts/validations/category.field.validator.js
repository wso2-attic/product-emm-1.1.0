/*
 Description: The following class is used to validate category field
 Filename: category.field.validator.js
 Created Date: 15/11/2013
 */
var validatorModule = function () {
    var log = new Log('category.field.validator');

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
     The function is used to check for provided category
     */
    function execute(context) {

        var template = context.template;
        var model = context.model;
        var report = context.report;
        var field = model.get('overview.category');

        //Go through each field and check category
        if (field) {
            for (var index in template.tables) {

                validateCategory(template.tables[index], model.get("overview.category").value, report);

            }
        }
        return true;
    }

    /*
     The function traverses each field in the provided table
     @table: An extension template table instance
     @category: Provided category
     @report: The report on the validation
     */
    function validateCategory(table, category, report) {
        var field;
        for (var fieldIndex in table.fields) {

            field = table.fields[fieldIndex];
            if (field.name == 'Category') {
                var arry = field.value;
                if (arry.indexOf(category) != -1) {
                    log.debug("Correct category provided !");
                    return true;
                } else {
                    report.record(field.name, 'Error incorrect category.' + field.name);
                    return;
                }
            }

        }
    }

    return{
        isApplicable: isApplicable,
        execute: execute
    }
}
