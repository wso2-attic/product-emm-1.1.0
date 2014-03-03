/*
	Loads and parses a given ext file
*/
var ext_domain=require('extension.domain.js').extension_domain();
var utility=require('/modules/rxt/utility.js').rxt_utility();

var extension_parser=function(){


	function Parser(){
		this.templates=[];
        this.valueLists=[];
        this.globalTemplate=new ext_domain.ExtTemplate(ext_domain.DEFAULT_SCOPE);
       // print('--------------'+stringify(this.globalTemplate));
	}

	Parser.prototype.getTemplate=function(type){

	    if(type=='*'){
	        return this.globalTemplate;
	    }
				
		for each(var  item in this.templates){
			
			if(item.name==type){
				return item;
			}
		}

		return null;
	}

    /*
	 * The function returns the table given the table name
	 */
	Parser.prototype.getTable=function(tableName,template){

         for each(var table in template.tables)
         {
               if(table.name.toLowerCase()==tableName.toLowerCase()){

                return table;
               }
         }
         return null;
	}

	Parser.prototype.getField=function(fieldName,table){

        for each(var field in table.fields){
             // print('comparing field '+fieldName+' with '+field.name+'<br/>');
              if(field.name.toLowerCase()==fieldName.toLowerCase()){
                 return field;
              }
        }

        return null;
	}

	Parser.prototype.getFieldFromTable=function(fieldName,tableName,template){
        var table=this.getTable(tableName,template);
       // print(table);
        var field=null;
        //print('looking for field '+fieldName+' in table: '+tableName+'<br/>');
        if(table){
            //print('looking in table '+tableName+'<br/>');
            field=this.getField(fieldName,table);
            //print('found field: '+stringify(field)+'<br/>');
        }

        return field;
	}

	// Converts the rxt template to an ExtensionTemplate
	// If an extension template which handles it is already present
	// then the appropriate values are overridden
	Parser.prototype.registerRxt=function(rxtTemplate){
	
		var template=this.getTemplate(rxtTemplate.shortName);
        //var extTemplate=new ext_domain.ExtTemplate(rxtTemplate.shortName);
    	//print('<br/> r1 template#: '+this.templates.length+'<br/>');
		if(template==null)
		{
			//print('Adding template');
            this.processRxt(rxtTemplate);
			//this.templates.push(extTemplate);
			//print('<br/> template:'+stringify(this.templates)+'<br/>');
		}


	}

    /*
	 * Converts a rxt template to a extension file
	 */
	Parser.prototype.processRxt=function(rxtTemplate)
	{
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
		//print('number of templates '+this.templates.length);
		this.templates.push(extTemplate);
	}
	
	/*
	 * Converts an array to a csv
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

	Parser.prototype.processExtension=function(extTemplate){

        // Assume the extension is applicable to a global scope
        var template=this.globalTemplate;


        // Determine the scope of the extension
        if(extTemplate.applyTo!=ext_domain.DEFAULT_SCOPE)
        {
            template=this.getTemplate(extTemplate.applyTo);
        }
        
        //print(template);
        
        // Fill the tables first
        this.fill('tables',extTemplate,template)
        // print(template);
		// Go through each property in the template
		for (var key in extTemplate)
		{
		       // print('examining prop '+key+'<br/>');
               this.fill(key,extTemplate,template);

		}

		//print(template);
		
	}

	Parser.prototype.fill=function(key,template,destination){

	    var data=template[key];
	    
	    //If there is no such property do not change
	    if(!data)
	    {
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
	}

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
                       //print('overriding existing field<br/>');
                }
                else
                {
                      //print('adding to table: '+field.table+'<br/>');
                      var table=this.getTable(field.table,template);

                      var fieldInstance=new ext_domain.Field();

                      utility.config(field,fieldInstance);
                      // Add a new field
                     table.fields.push(field);
                }

                //print('->'+stringify(field)+'*<br/>');

          }
	}
	
	/*
	 * The function loads all of the extension files in a given directory
	 */
	Parser.prototype.load=function(path){
		var dir=new File(path);
		if(!dir.isDirectory()){
			throw "RXT Extension path is not a directory.Please specify an directory for the extension path";
		}
		
		var files=dir.listFiles();
		
		for each(var file in files){
			//Only process json files and ignore temporary files
			if((file.getName().indexOf('.json')!=-1)
			&&(file.getName().indexOf('~')==-1)){

				var config=require(path+file.getName());
				
				this.processExtension(config);			
			}
			
		}
	}

    /*
	 * Loads the tables into the template
	 */
    Parser.prototype.fillTable=function(tablesArray,template){
    	
    	//print(tablesArray);

        // Go through each table
       for each(var table in tablesArray){

           // Check if the table exists
           var tableSource=this.getTable(table.name,template);



           if(tableSource)
           {

                utility.config(table,tableSource);
           }
           else{

                var tableSource=new ext_domain.Table();

                utility.config(table,tableSource);

                template.tables.push(tableSource);

           }
       }

    }
    
    Parser.prototype.fillImports=function(importArray,template){
    	template.import=importArray;
    }
    
    Parser.prototype.fillFieldProperties=function(propertyArray,template){
    	template.fieldProperties=propertyArray;
    }
    
    Parser.prototype.fillPropertyRules=function(ruleArray,template){
    	template.fieldPropertyRules=ruleArray;
    }
    
    function RuleParser(options){
    	this.parser=null;
    	utility.config(options,this);
    }
    
    RuleParser.prototype.init=function(){
    	for each(var template in this.parser.templates){
    		this.parseAll(template);
    	}
    }
    
    RuleParser.prototype.parseAll=function(template){
    	for each(var rule in template.fieldPropertyRules){
    		this.process(rule,template);
    	}
    }
    
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
    	//print(fieldInstance);
    	if(fieldInstance){
    		applyRuleField(action,fieldInstance);
    	}
    }
    
    function applyRuleField(rule,field){
    	var actionComp=rule.split('=');
    	
    	if(actionComp.length==0){
    		throw 'Rule is not valid';
    	}
    	
    	var prop=actionComp[0];
    	var value=actionComp[1];
    	
    	if(field.hasOwnProperty(prop)){
    		field[prop]=value;
    		return;
    	}
    	
    	field.meta[prop]=value;
    	
    }
    
	return{
		Parser:Parser,
		RuleParser:RuleParser
	}

};
