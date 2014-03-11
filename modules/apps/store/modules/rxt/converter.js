var utility=require('utility.js').rxt_utility();
var rxt_domain=require('rxt.domain.js').rxt_domain();
var log=require('log.js').LogContainer();


	/*
	Description: The file holds the logic used to generate RXT templates
	Filename:converter.js
	Created Date: 28/7/2013
	*/

var rxt_converter=function(){


	function XmlConversionProcess(options){
		this.xmlDocument=null;
		this.rxtTemplate=new rxt_domain.RxtTemplate();
		this.mnger=null;
		this.instrList=null;
		this.currentRoot=null;
		utility.config(options,this);
		
	}

	XmlConversionProcess.prototype.execute=function(xmlDocument,rxtTemplate){
		if(xmlDocument){
			this.xmlDocument=xmlDocument;
		}

		if(rxtTemplate){
			this.rxtTemplate=rxtTemplate;
		}

		this.instrList.execute(this);	
		return this.rxtTemplate;
	}

	function InstrList(options){
		this.instr=[];
		utility.config(options,this);
	}

	InstrList.prototype.execute=function(context){
		context.root=context.xmlDocument;
		for(var i=0;i<this.instr.length;i++){
			var handler=context.mnger.getHandler(this.instr[i]);
	
			if(handler){
				handler.execute(context);
			}
		}
	}

	function Handler(options){
		this.fn=null;
		this.tag='';
		utility.config(options,this);
	}

	Handler.prototype.execute=function(context){
		//Do nothing this is the default handler
		if(this.fn){
			this.fn(context);
		}
	}


	
	function HandlerManager(){
		this.handlers=[];
	}

	
	HandlerManager.prototype.registerHandler=function(handler){
		this.handlers.push(handler);
	}

	HandlerManager.prototype.xmlQueryAttr=function(xmlRoot,attr){
		return xmlRoot['@'+attr+''].toString();
	}

	HandlerManager.prototype.xmlQueryElement=function(xmlRoot,attr){
		return xmlRoot[''+attr+''].toString();
	}

	/*
	*/
	HandlerManager.prototype.fill=function(xmlRoot,object){

		//Go through all properties in the object
		for(var key in object){

			if((typeof object[key]!='function')&&(!(object[key] instanceof Array))){

				var value=this.xmlQueryAttr(xmlRoot,key);


				if(value==''){
					value=this.xmlQueryElement(xmlRoot,key);
				}

				if(value!=''){

					object[key]=value;
				}
				
			}
		}
	}


	HandlerManager.prototype.getHandler=function(strTag){

		for(var i=0;i<this.handlers.length;i++){
	
			if(this.handlers[i].tag==strTag){
				return this.handlers[i];
			}
		}
		
		return null;
	}

	var mnger=new HandlerManager();

	mnger.registerHandler(new Handler({ tag:'head', fn:function(context){
		log.debug(stringify(context.rxtTemplate));
		mnger.fill(context.xmlDocument,context.rxtTemplate);
		log.debug(stringify(context.rxtTemplate));
	
	}}));

	mnger.registerHandler(new Handler({ tag:'ui', fn:function(context){
		//Implement ui handler
	
	}}));

	mnger.registerHandler(new Handler({ tag:'body', fn:function(context){
				
		
	}}));

	mnger.registerHandler(new Handler({ tag:'content', fn:function(context){
		var content=context.xmlDocument.content;

		
		for each(var table in content.table){
			
			var objTable=new rxt_domain.Table();

			mnger.fill(table,objTable);

			//Go through each field in the table
			for each(var field in table.field){

				var objField=new rxt_domain.Field();
				
				//Fill the current field
				mnger.fill(field,objField);


				var objName=new rxt_domain.Name();
	
				
				mnger.fill(field.name,objName);
				objName.name=field.name.toString();		
				objField.addName(objName);


				//Check if there are any values
				for each(var v in field.values.value){	
					objField.addValue(v.toString());
				}

				log.debug('objField: '+stringify(objField));
		
				//Add the field to the table
				objTable.addField(objField);
			}
		

			//Add the table to the template
			context.rxtTemplate.getContent().addTable(objTable);
		}
	}}));


	var instr=new InstrList({ instr: ['head','ui','content'] } );


	return{
		XmlConversionProcess:XmlConversionProcess,
		Handler:Handler,
		converter:mnger,
		instrList:instr
	}
};
