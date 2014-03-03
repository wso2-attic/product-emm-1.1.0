var ext_domain=require('extension.domain.js').extension_domain();
var utility=require('/modules/rxt/utility.js').rxt_utility();

var extension_management=function(){
	
	/*
	 * A proxy which interacts with the user
	 */
	function Model(options){
		this.dataModel=new ext_domain.DataModel();
		this.adapterManager=null;
		this.template=null;	//The template of the data stored in the model
		utility.config(options,this);
		this.init();
	}
	
	/*
	 * Preload the tables and fields in the template
	 * to the data model
	 */
	Model.prototype.init=function(){
		//Go through each table
		for each(var table in this.template.tables){
			
			//Go through each field
			for each(var field in table.fields){
				
				this.dataModel.setField(table.name+'.'+field.name,field.value);
			}
		}
	}
	
	Model.prototype.set=function(fieldName,value){
		this.dataModel.setField(fieldName,value);
	}
	
	Model.prototype.get=function(fieldName){
		return this.dataModel.getField(fieldName);
	}
	
	Model.prototype.export=function(type){
		var adapter=this.adapterManager.find(type);
		return adapter.execute({model:this.dataModel,template:this.template});
	}
	
	Model.prototype.import=function(type,inputData){
		var adapter=this.adapterManager.find(type);
		var context=this.getContext();
		context['inputData']=inputData;
		//print('--==about to execute'+stringify(context));
		adapter.execute(context);
		//print('after execution');
	}
	
	Model.prototype.getContext=function(){
		return {model:this.dataModel,template:this.template};
	}
	
	/*
	 * The class is used to create models based on
	 * predefined templates
	 */
	function ModelManager(options){
		this.parser=null;
		this.adapterManager=null;
		utility.config(options,this);
	}
	/*
	 * Creates a model instance that is used 
	 */
	ModelManager.prototype.getModel=function(type){
		//Obtain the template of the model from the parser
		for each(var template in this.parser.templates){
			
			if(template.applyTo==type){
				return new Model({template:template,adapterManager:this.adapterManager});
			}
		}
		
		return null;
	}
	
	return{
		ModelManager:ModelManager
	}
	
};