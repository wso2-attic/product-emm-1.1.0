var meta={
	use:'import',
	type:'asset',
	required:['model','template','inputData']
};
var log=new Log();
/*
 * Converts asset
 */
var module=function(){
	
	function processAttributes(model,data){
		
		//Go through each attribute
		for(var key in data.attributes){

			var value=data.attributes[key];
			//Break it up
			var name=key.split('_');
			if((name.length>0)&&(name.length<=2)){

				var table=name[0];
				var field=name[1];

				model.setField(table+'.'+field,value);
			}

		}
		
	}
	
	function processHeader(model,data){
		model.setField('*.id',data.id);
		model.setField('*.type',data.type);
		model.setField('*.lifecycle',data.lifecycle);
		model.setField('*.lifecycleState',data.lifecycleState);
	}
	
	return{
		execute:function(context){
			var model=context.model;
			var template=context.template;
			var data=context.inputData;
			
			if((!model)||(!template)||(!data)){
				throw 'Required model,data and templates not within context';
			}

			processHeader(model,data);
			processAttributes(model,data);
					
		}
	}
};
