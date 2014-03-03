/*
Description: used in parsing the extension files for the Rxt templates
Filename:extension.parser.js
Created Date: 8/8/2013
*/
var ext_domain=require('extension.domain.js').extension_domain();
var utility=require('/modules/utility.js').rxt_utility();

var extension_parser=function(){

    var log=new Log();

	function Parser(){
		this.templates=[];
        this.valueLists=[];
        this.globalTemplate=new ext_domain.ExtTemplate(ext_domain.DEFAULT_SCOPE);
	}

    /*
    The function returns the extension template for the provided rxt type
    @type: A valid rxt type (e.g. gadget, site ,url etc)
    @returns: An extension template for the given type if it is found,else null.
     */
	Parser.prototype.getTemplate=function(type){

	    if(type=='*'){

	        return this.globalTemplate;
	    }
				
		for each(var  item in this.templates){
			
			if(item.name==type){
				return item;
			}
		}
        log.debug('The extension template type: '+type+' could not be located.');
		return null;
	};

    /*
	 * The function returns the table name and the extension template in which to search
	 * @tableName: The name of a table inside the provided template
	 * @template: An extension template with one or more tables
	 * @returns: An table object if it is found,else null
	 */
	Parser.prototype.getTable=function(tableName,template){

         for each(var table in template.tables)
         {
               if(table.name.toLowerCase()==tableName.toLowerCase()){

                return table;
               }
         }

         log.debug('The table: '+tableName+' could not be located inside the extension template '+template.name);
         return null;
	};

    /*
    Locates a field instance inside a table object
    @fieldName: A field name
    @table: A table instance
    @returns: A field instance with the fieldName or null if it is not found.
     */
	Parser.prototype.getField=function(fieldName,table){

        for each(var field in table.fields){
             // print('comparing field '+fieldName+' with '+field.name+'<br/>');
              if(field.name.toLowerCase()==fieldName.toLowerCase()){
                 return field;
              }
        }

        log.debug('The field: '+fieldName+' could not be located inside the table '+table.name);
        return null;
	};

    /*
    Locates a field from a table inside a given extension template
    @fieldName: A field name
    @tableName: A table name
    @template: An extension template in which the field and table may occur
    @returns: A field instance if it is found,else null
     */
	Parser.prototype.getFieldFromTable=function(fieldName,tableName,template){
        var table=this.getTable(tableName,template);

        var field=null;

        if(table){

            field=this.getField(fieldName,table);

        }
        log.debug('The field: '+fieldName+' could be located inside the table '+table.name+' in the template: '+template.name);
        return field;
	};

	/*
	Converts the rxt template to an ExtensionTemplate
	If an extension template which handles it is already present
	then the appropriate values are overridden
	@rxtTemplate: A template to be registered
	*/
	Parser.prototype.registerRxt=function(rxtTemplate){

        //Check if the template already exists
		var template=this.getTemplate(rxtTemplate.shortName);

        //Only register a template once
		if(template==null)
		{
            log.debug('Registering rxt template: '+rxtTemplate.shortName);
            this.processRxt(rxtTemplate);
		}

        log.debug('Finished processing all rxt templates');
	};

    /*
	 * Converts a rxt template to a extension file
	 */
	Parser.prototype.processRxt=function(rxtTemplate)
	{

        log.debug('Processing template: '+rxtTemplate.shortName);
		var extTemplate=new ext_domain.ExtTemplate(rxtTemplate.shortName);
		extTemplate.applyTo=rxtTemplate.shortName;
		extTemplate.shortName=rxtTemplate.shortName;
		extTemplate.singularLabel=rxtTemplate.singularLabel;
		extTemplate.pluralLabel=rxtTemplate.pluralLabel;
		extTemplate.import=[];

		// Go through each table
		for each(var table in rxtTemplate.getContent().tables)
		{
			var extTable=new ext_domain.Table(table.name);
			
			for each(var field in table.fieldsArray)
			{
				var extField=new ext_domain.Field();
				extField.name=field.name.name;
				extField.label=field.name.getLabel();
				extField.table=extTable.name;
				extField.type=field.type;
				extField.required=field.required;

				extField.value=getCsvValues(field.values);
				
				extTable.fields.push(extField);
			}

			extTemplate.tables.push(extTable);
		}
        log.debug('Finished processing template: '+rxtTemplate.shortName);
		this.templates.push(extTemplate);
	};
	
	/*
	 * A utility function to convert an array into a comma seperated variable list
	 * @value: The array to be converted
	 * @returns: A comma seperated variable list containing the contents of the array
	 */
	function getCsvValues(value){
		if(value instanceof Array){
			var csv='';
			var count=0;
			for each(var item in value){
				if(count>0){
					csv+=','
				}
				csv+=item;
				count++;
				
			}
			
			return csv;
		}
		
		return value;
	}

    /*
    Parses an extension template
     */
	Parser.prototype.processExtension=function(extTemplate){

        log.debug('Processing extension : '+extTemplate.applyTo);
        // Assume the extension is applicable to a global scope
        var template=this.globalTemplate;

        // Determine the scope of the extension
        if(extTemplate.applyTo!=ext_domain.DEFAULT_SCOPE)
        {
            template=this.getTemplate(extTemplate.applyTo);
        }

        if(!template){
            log.debug('The extension references an rxt which is not available in the registry.');
            return;
        }

        // Fill the tables first
        this.fill('tables',extTemplate,template)

		// Go through each property in the template
		for (var key in extTemplate)
		{
		       // print('examining prop '+key+'<br/>');
               this.fill(key,extTemplate,template);

		}
        log.debug('Finished processing extension: '+extTemplate.applyTo);

	};


	Parser.prototype.fill=function(key,template,destination){

	    var data=template[key];
	    
	    //If there is no such property do not change
	    if(!data)
	    {
            log.debug('No data configuration called property: '+key+' in template '+template.name);
	    	return;
	    }
	    
        switch(key){
        case 'fields':
            this.fillFields(data,destination);
            break;
        case 'tables':
            this.fillTable(data,destination);
            break;
        case 'fieldProperties':
        	this.fillFieldProperties(data,destination);
        	break;
        case 'fieldPropertyRules':
        	this.fillPropertyRules(data,destination);
        	break;
        case 'import':
        	this.fillImports(data,destination);
        	break;
        default:
            break;
        }
	};

    /*
	 * Loads the fields into the template
	 */
	Parser.prototype.fillFields=function(fieldsArray,template){

          // Go through each field
          for each(var field in fieldsArray){

                // Check if the field is present in the specified table
                var fieldSource=this.getFieldFromTable(field.name,field.table,template);

                if(fieldSource)
                {
                       // Override only the properties which are declared
                       utility.config(field,fieldSource);
                }
                else
                {

                      var table=this.getTable(field.table,template);

                      var fieldInstance=new ext_domain.Field();

                      utility.config(field,fieldInstance);
                      // Add a new field
                     table.fields.push(field);
                }

          }
	};
	
	/*
	 * The function loads all of the extension files in a given directory
	 */
	Parser.prototype.load=function(path){
        log.debug('Looking for extension files in '+path);
		var dir=new File(path);

		if(!dir.isDirectory()){
            log.debug('Extension path is not a directory.');
			throw "RXT Extension path is not a directory.Please specify an directory for the extension path";
		}
		
		var files=dir.listFiles();
		
		for each(var file in files){
			//Only process json files and ignore temporary files
			if((file.getName().indexOf('.json')!=-1)
			&&(file.getName().indexOf('~')==-1)){

				var config=require(path+file.getName());
				log.debug('Processing extension file: '+file.getName());

                //Only process the extension if there is a configuration
                if(config){

                    this.processExtension(config);
                }

                log.debug('Finished extension file: '+file.getName());
			}
			
		}
	};

    /*
	 * Parses the table configuration data in the extension template
	 */
    Parser.prototype.fillTable=function(tablesArray,template){

        // Go through each table
       for each(var table in tablesArray){

           // Check if the table exists
           var tableSource=this.getTable(table.name,template);

           //If the table exists,ovveride the provided data only
           if(tableSource)
           {
                utility.config(table,tableSource);
           }
           else{
                //Add a new table if it is not found
                var tableSource=new ext_domain.Table();

                utility.config(table,tableSource);

                template.tables.push(tableSource);

           }
       }

    };
    
    Parser.prototype.fillImports=function(importArray,template){
    	template.import=importArray;
    } ;
    
    Parser.prototype.fillFieldProperties=function(propertyArray,template){
    	template.fieldProperties=propertyArray;
    };
    
    Parser.prototype.fillPropertyRules=function(ruleArray,template){
    	template.fieldPropertyRules=ruleArray;
    };

    /*
    The class is used to parse fieldProperty rules
     */
    function RuleParser(options){
    	this.parser=null;
    	utility.config(options,this);
    }
    
    RuleParser.prototype.init=function(){
    	for each(var template in this.parser.templates){
    		this.parseAll(template);
    	}
    };
    
    RuleParser.prototype.parseAll=function(template){
    	for each(var rule in template.fieldPropertyRules){
            log.debug('Parsing rule: '+rule+' in template: '+template.name);
    		this.process(rule,template);
    	}
    };
    
    RuleParser.prototype.process=function(rule,template){
    	//Break the rule using the :
    	var comps=rule.split(':');
    	if(comps.length==0){
    		throw 'Rule :'+rule+' is not valid.';
    	}
    	var target=comps[0];
    	var action=comps[1];
    	
    	//Identify the composition of the rule
    	var targetComp=target.split('.');

    	if(targetComp.length==0){
    		throw 'Target: '+target+' is not valid.';
    	}
    	
    	var table=targetComp[0];
    	var field=targetComp[1];
    	
    	var fieldInstance=this.parser.getFieldFromTable(field,table,template);

    	if(fieldInstance){
    		applyRuleField(action,fieldInstance);
    	}
    };


    function applyRuleField(rule,field){
    	var actionComp=rule.split('=');
    	
    	if(actionComp.length==0){

    		throw 'Rule is not valid';
    	}
    	
    	var prop=actionComp[0];
    	var value=actionComp[1];
    	
    	if(field.hasOwnProperty(prop)){
            log.debug('Setting property of field: '+filed.name+' '+prop+' = '+value);
    		field[prop]=value;
    		return;
    	}

        log.debug('Setting meta property of field: '+field.name+' '+prop+' = '+value);
    	field.meta[prop]=value;
    	
    }
    
	return{
		Parser:Parser,
		RuleParser:RuleParser
	}

};
