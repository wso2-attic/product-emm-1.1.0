var utility=require('/modules/rxt/utility.js').rxt_utility();

var extension_domain=function(){

var DEFAULT_SCOPE='*';	// Applies to all template types
	var EMPTY='';

	function ExtTemplate(name){

		// Defines whether the extensions rules specified in a file
		// should be applied to all template files or just to a specified
		// template
		this.applyTo=DEFAULT_SCOPE;
		this.name=name;			// Used to uniquely identify the extension file
	

		// Extra fields
		this.fields=[];

		// Additional tables
		this.tables=[];
		
		this.import=[];
		
		this.fieldProperties=[];
		
		this.singularLabel='';
		this.pluralLabel='';
		this.shortName='';
	}
	
	/*
	 * Finds the table 
	 */
	ExtTemplate.prototype.getTable=function(tableName){
		for each(var table in this.tables){
			if(table.name.toLowerCase()==tableName.toLowerCase()){
				return table;
			}
		}
		
		return null;
	}
	
	/*
	 * Finds specified field inside the provided table
	 */
	ExtTemplate.prototype.getField=function(tableName,fieldName){
		
		var table=this.getTable(tableName);
		
		if(!table){
			return null;
		}
		
		for each(var field in table.fields){
			if(field.name.toLowerCase()==fieldName.toLowerCase()){
				return field;
			}
		}
		
		return null;
	}


	function Table(name){
		this.name=name;
		this.label='';
		this.fields=[];
	}

	function Field(){
		this.name='';
		this.label='';
		this.table='';
		this.type='';
		this.value='';
		this.meta={};
		this.required='false';
		
	}


   /*
    * The DataModel class stores data in a grouped manner 
    * based on tables
    */
    function DataModel(options){
        this.dataTables=[];
        utility.config(options,this);
    }
    

    /*
     * The function returns the name of all of the 
     * tables
     */
    DataTable.prototype.getTableNames=function(){
    	var nameArray=[];
    	
    	for each(var table in  this.dataTables){
    		nameArray.push(table.name);
    	}
    	
    	return nameArray;
    }
    
    /*
	 * Returns the table with the specified name
	 */
    DataModel.prototype.getTable=function(name){

    	 
         for each(var table in  this.dataTables){

             // Identify the table
             if(table.name.toLowerCase()==name.toLowerCase()){
                return table;
             }
         }

         return null;
    }

    /*
     * Returns a field based on the provided name
     */
    DataModel.prototype.getField=function(name){

         // Find the table name
         var nameComponents=name.split('.');
         var tableName=nameComponents[0];
         var fieldName=nameComponents[1];

         if((!tableName)||(!fieldName)){
            return null;
         }

         // Obtain the table instance
         var table=this.getTable(tableName);
         
         //Returns nothing if the table is not found
         if(!table){
        	 return null;
         }

         // Obtain the field
        return table.getField(fieldName);
    }
    
    /*
     * The function sets the value of a field
     */
    DataModel.prototype.setField=function(name,value){
        // Find the table name
        var nameComponents=name.split('.');
        var tableName=nameComponents[0];
        var fieldName=nameComponents[1];

        if((!tableName)||(!fieldName)){
           return null;
        }
        
        // Obtain the table instance
        var table=this.getTable(tableName);
        
        //If the table does not exist create a new one
        if(!table){
        	table=new DataTable({name:tableName});
        	this.dataTables.push(table);
        } 
        
        table.setField(fieldName,value)
    }

    // Describes an instance of artifact
	function DataTable(options){
	    this.name=null;
	    this.fields=[];
        utility.config(options,this);
	}

   	// Creates DataField objects based on the table
	DataTable.prototype.init=function(){

        for each(var field in this.table.fields){
            this.fields.push(new DataField(
            {
                name: table.name+'.'+field.name,
                value:''
            }));
        }
	}

   	 /*
	 * The function finds a particular field
	 */
	DataTable.prototype.getField=function(fieldName){

         for each(var field in this.fields){
                if(field.getName().toLowerCase()==fieldName.toLowerCase()){
                    return field;
                }
         }

         return null;
	}
	
	/*
	 * Sets the value of a field
	 */
	DataTable.prototype.setField=function(fieldName,value){
		
		for each(var field in this.fields){
			if(field.getName().toLowerCase()==fieldName.toLowerCase()){
				field.setValue(value);
				return;
			}
		}
		
		this.fields.push(new DataField({name:fieldName,value:value}));
	}

    /*
     * Describes a single property of an artifact
     */
	function DataField(options){
            this.name='';
            this.value='';
            utility.config(options,this);
	}

	DataField.prototype.getName=function(){
            return this.name;
	}

	DataField.prototype.getValue=function(){
            return this.value;
	}

	DataField.prototype.setValue=function(value){
            this.value=value;
	}
	

	return{
		DataModel:DataModel,
		ExtTemplate:ExtTemplate,
		Table:Table,
		Field:Field,
		DataModel:DataModel,
		DataTable:DataTable,
		DataField:DataField
	};
};
