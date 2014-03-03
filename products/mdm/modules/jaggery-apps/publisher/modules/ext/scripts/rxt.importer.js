var meta={
	use:'import',
	type:'asset',
	required:['model','template','inputData']
};

/*
 Description: Reads and sets the data from an asset object
 Filename: rxt.importer.js
 Created Date: 8/8/2013
 */
var module=function(){

    var log=new Log();

	function processAttributes(model,data){
		
		//Go through each attribute
		for(var key in data.attributes){

			var value=data.attributes[key];

			//Break it up
			var name=key.split('_');

			log.debug('Obtaining data from : '+name);

			if((name.length>0)&&(name.length<=2)){

				var table=name[0];
				var field=name[1];

                log.debug('Saving field '+field+'= '+value+' in table: '+table);

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

            log.debug('Entered: '+meta.type);

			var model=context.model;
			var template=context.template;
			var data=context.inputData;
			
			if((!model)||(!template)||(!data)){
                log.debug('Requir')
				throw 'Required model,data and templates not within context';
			}

			processHeader(model,data);
			processAttributes(model,data);

            log.debug('Data extracted: '+stringify(this.model));

            log.debug('Exited: '+meta.type);
		}
	}
};
