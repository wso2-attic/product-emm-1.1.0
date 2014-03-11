/*
 * 
 */

var utility=require('/modules/rxt/utility.js').rxt_utility();

var extension_core=function(){
	
	function AdapterManager(options){
		this.parser={};
		this.adapters=[];
		utility.config(options,this);
	}
	
	/*
	 * Initializes the adapter by loading up all of the templates
	 */
	AdapterManager.prototype.init=function(){
				
		// Go through all of the imports and load all of the scripts
		for each(var template in this.parser.templates){
			
			// Only process if there are imports
			if(template.import){
				
				// Go through each import
				for each(var item in template.import){
				
					var instance=require(item);
					
					this.adapters.push(new AdapterContainer(instance));
				}
			}
		}
		
		
	}
	
	/*
	 * Locates an adpater matching the required type @type: The type of the
	 * adapter @return: The adapter
	 */
	AdapterManager.prototype.find=function(type){
		
		for each(var adapter in this.adapters){
			//print(adapter.meta.type);
			if(adapter.meta.type==type){
				return adapter;
			}
		}		
		return null;
	}
	
	function AdapterContainer(instance){
		this.meta=instance.meta;
		this.instance=instance.module();
	}
	
	/*
	 * Executes the logic of the adapter @context: The context within which the
	 * adapter must be executed
	 */
	AdapterContainer.prototype.execute=function(context){
		return this.instance.execute(context);
	}
	
	function FieldManager(options){
		this.parser=null;
		utility.config(options,this);
	}
	
	/*
	 * The function processes all templates in the parser
	 */
	FieldManager.prototype.init=function(){
		//Go through all of the templates
		for each(var template in this.parser.templates){
			this.process(template);
		}
	}
	
	/*
	 * The function processes all of the templates and
	 */
	FieldManager.prototype.process=function(template){
		//print(template);
		// Go through each field properties
		for each(var fieldProperty in template.fieldProperties){
			
			if(fieldProperty.field=='*'){
				//All the fields in all of the tables
				for each(var table in template.tables){
					addProperty(table,fieldProperty);
				}
			}
			else{
				var scope=fieldProperty.field.split('.');
				var table=scope[0];
				var field=scope[1];
				
				if(field=='*'){
					//Find the specified table
					var tableInstance=this.parser.getTable(table,template);
					
					addProperty(tableInstance,fieldProperty);
				}
				else{
					var fieldInstance=this.parser.getFieldFromTable(field,table,template);
					
					addPropertyToField(fieldInstance,fieldProperty);
				}
	
			}
		}
		
		//print(template);
	}
	
	
	
	/*
	 * Adds the provided property to the table
	 */
	function addProperty(table,property){
		for each(var field in table.fields){
			addPropertyToField(field,property);
		}
	}
	
	/*
	 * Adds the provided property to the field
	 */
	function addPropertyToField(field,property){
		//print('<br/>'+stringify(field));
		if(!field.meta){
			field.meta={};
		}
		
		//field.meta[property.name]=1;
		//print('<br/>'+stringify(field.meta));
		field.meta[property.name]=property.value;
	}
	
	return{
		AdapterManager:AdapterManager,
		FieldManager:FieldManager
	}
}