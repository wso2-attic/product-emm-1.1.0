var utility = require('utility.js').rxt_utility();
var rxt_domain = require('rxt.domain.js').rxt_domain();

/*
 Description: The file holds the logic used to generate RXT templates
 Filename:converter.js
 Created Date: 28/7/2013
 */

var rxt_converter = function () {

    var log=new Log();
    function XmlConversionProcess(options) {
        this.xmlDocument = null;
        this.rxtTemplate = new rxt_domain.RxtTemplate();
        this.mnger = null;
        this.instrList = null;
        this.currentRoot = null;
        utility.config(options, this);

    }

    XmlConversionProcess.prototype.execute = function (xmlDocument, rxtTemplate) {
        if (xmlDocument) {
            this.xmlDocument = xmlDocument;
        }

        if (rxtTemplate) {
            this.rxtTemplate = rxtTemplate;
        }

        this.instrList.execute(this);
        return this.rxtTemplate;
    }

    function InstrList(options) {
        this.instr = [];
        utility.config(options, this);
    }

    InstrList.prototype.execute = function (context) {
        context.root = context.xmlDocument;
        for (var i = 0; i < this.instr.length; i++) {
            var handler = context.mnger.getHandler(this.instr[i]);

            if (handler) {
                handler.execute(context);
            }
        }
    }

    function Handler(options) {
        this.fn = null;
        this.tag = '';
        utility.config(options, this);
    }

    Handler.prototype.execute = function (context) {
        //Do nothing this is the default handler
        if (this.fn) {
            this.fn(context);
        }
    }


    function HandlerManager() {
        this.handlers = [];
    }


    HandlerManager.prototype.registerHandler = function (handler) {
        this.handlers.push(handler);
    }

    HandlerManager.prototype.xmlQueryAttr = function (xmlRoot, attr) {
        return xmlRoot['@' + attr + ''].toString();
    }

    HandlerManager.prototype.xmlQueryElement = function (xmlRoot, attr) {
        return xmlRoot['' + attr + ''].toString();
    }

    /*
     */
    HandlerManager.prototype.fill = function (xmlRoot, object) {

        //Go through all properties in the object
        for (var key in object) {

            if ((typeof object[key] != 'function') && (!(object[key] instanceof Array))) {

                var value = this.xmlQueryAttr(xmlRoot, key);


                if (value == '') {
                    value = this.xmlQueryElement(xmlRoot, key);
                }

                if (value != '') {

                    object[key] = value;
                }

            }
        }
    }


    HandlerManager.prototype.getHandler = function (strTag) {

        for (var i = 0; i < this.handlers.length; i++) {

            if (this.handlers[i].tag == strTag) {
                return this.handlers[i];
            }
        }

        return null;
    }

    var mnger = new HandlerManager();

    mnger.registerHandler(new Handler({ tag: 'head', fn: function (context) {
        log.debug(stringify(context.rxtTemplate));
        mnger.fill(context.xmlDocument, context.rxtTemplate);
        log.debug(stringify(context.rxtTemplate));

    }}));

    mnger.registerHandler(new Handler({ tag: 'ui', fn: function (context) {
        //Implement ui handler

    }}));

    mnger.registerHandler(new Handler({ tag: 'body', fn: function (context) {


    }}));

    mnger.registerHandler(new Handler({ tag: 'content', fn: function (context) {
        var content = context.xmlDocument.content;


        for each(var table
        in
        content.table
        )
        {

            var objTable = new rxt_domain.Table();

            mnger.fill(table, objTable);

            //Handle multi-word table names
            handleMultiComponentTableNames(objTable);

            //Go through each field in the table
            for each(var field
        in
            table.field
        )
            {

                var objField = new rxt_domain.Field();

                //Fill the current field
                mnger.fill(field, objField);


                var objName = new rxt_domain.Name();


                mnger.fill(field.name, objName);
                objName.name = field.name.toString();
                objField.addName(objName);

                //Handle multi-word field names
                handleMultiComponentFieldNames(objField);


                //Check if there are any values
                for each(var v
            in
                field.values.value
            )
                {
                    //log.debug(v.toString());
                    //log.debug(stringify(objField));
                    objField.addValue(v.toString());
                }

                log.debug('objField: ' + stringify(objField));

                //Add the field to the table
                objTable.addField(objField);
            }

            log.debug('table: ' + stringify(objTable));

            //Add the table to the template
            context.rxtTemplate.getContent().addTable(objTable);
        }
    }}));


    var FIRST_CHAR = 0;
    var SECOND_CHAR = 1;
    var ONE_WORD = 1;
    var FIRST_WORD = 0;


    /*
     The function handles situations where the field name is specified with multiple words
     In such a case the name is written back in camel casing
     @field: The field object containing the name and the label.The processed name will be attached
     as the name
     */
    function handleMultiComponentFieldNames(field) {
        var name;
        var casedName;

        name = field.name.name;

        casedName = parseName(name);

        //Check if the field has a label
        if(field.name.label==''){
            field.name.label=name;
        }

        //log.info(field);

        field.name.name = casedName;
    }

    /*
    The function converts a multi-word table name to a camel cased table name
    If the table name is a single word then it is left unaltered
    @table: The table whose name will be processed,the processed name will be assigned
     */
    function handleMultiComponentTableNames(table) {
        var name;
        name = table.name;

        //log.info(table);
        name = parseName(name);

        table.name = name;
    }

    /*
     The function converts a multi word phrase to a single camel cased name
     @name: A single name or a multi word phrase to be converted to camel casing
     @return: A name which is camel cased (when consistig of multiple words)
     */
    function parseName(name) {

        var components = [];
        var modifiedComponents = [];
        var component;

        components = name.split(' ');

        //Check if there is only one word
        if (components.length <= ONE_WORD) {
            return components[0].toLowerCase();
        }

        //Go through each field in the components array
        for (var index in components) {
            component = components[index];
            component = component.toLowerCase();

            //We not want to capitalize the first word
            if (index != FIRST_WORD) {
                //Capitalize the first letter of the word and create the word again
                component = component.charAt(FIRST_CHAR).toUpperCase() + component.substring(SECOND_CHAR);
            }

            modifiedComponents.push(component);
        }

        return modifiedComponents.join('');
    }


    var instr = new InstrList({ instr: ['head', 'ui', 'content'] });


    return{
        XmlConversionProcess: XmlConversionProcess,
        Handler: Handler,
        converter: mnger,
        instrList: instr
    }
};
