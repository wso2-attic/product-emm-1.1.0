
	/*
	Description: The file holds all of the domain classes used to define an RXT template
	Filename:rxt.domain.js
	Created Date: 28/7/2013
	*/
var utility=require('utility.js').rxt_utility();

var rxt_domain=function(){

	//TODO: Add Relationships element

	/*
	Stores the structure of the RXT template as found in 
	the .rxt files
	Structure Derived from: http://docs.wso2.org/wiki/display/Governance453/Governance+Artifacts+Configuration+Model+Elements
	*/
	function RxtTemplate(options){

		this.type='';
		this.shortName='';
		this.singularLabel='';
		this.pluralLabel='';
		this.hasNamespace='';
		this.iconSet='';
		this.storagePath='';
		this.nameAttribute='';
		this.path='';
		
		this.uiBlock=new Ui();
		this.contentBlock=new Content();
		utility.config(options,this);
	}

	RxtTemplate.prototype.getContent=function(){
		return this.contentBlock;
	}

	RxtTemplate.prototype.getUi=function(){
		return this.uiBlock();
	}

	function Ui(options){
		this.list=new List();
		utility.config(options,this);
	}
	
	function Content(options){
		this.href='';
		this.tables=[];
		utility.config(options,this);
	}

	Content.prototype.addTable=function(table){
		this.tables.push(table);
	}

	function List(options){
		this.columns=[];
		utility.config(options,this);
	}

	List.prototype.addColumn=function(column){
		this.columns.push(column);
	}

	function Column(options){
		this.name=strName;
		this.data=[];
		utility.config(options,this);
	}

	Column.prototype.addData=function(data){
		this.data.push(data);
	}

	function Data(options){
		this.type=strType;
		this.value=strValue;
		this.href=strHref;

		utility.config(options,this);
	}

	/*
	The class describes a table structure used to 
	*/
	function Table(options){
		this.name='';
		this.columns=2; //Default according to http://docs.wso2.org/wiki/display/Governance453/Governance+Artifacts+Configuration+Model+Elements
		this.fieldsArray=[];
		this.subHeadings=new SubHeading();	//The subheadings must equal the number of columns

		utility.config(options,this);
	}

	Table.prototype.getFields=function(){
		return this.fieldsArray;
	}

	Table.prototype.addField=function(field){
		this.fieldsArray.push(field);
	}

	/*
	The function returns a particular field in a table
	@strName:The name of the required field
	@return: The matching field if found , else false
	*/
	Table.prototype.findField=function(name){
		//Go through each field in the array
		for(var field in fields){

			if(field.name==name){
				return field;
			}
		}
	}

	/*
	The class describes a single field in a Table object
	*/
	function Field(options){
		this.type='';
		this.required='';
		this.maxOccurs=-1; //By default is unbounded
		this.name=new Name();
		this.values=[];
		this.readOnly=false;
		
		utility.config(options,this);
	}

	
	Field.prototype.addName=function(name){
		this.name=name;
	}

	function Name(options){
		this.label='';	//If the label is not defined then the name is used
		this.name='';
		
		utility.config(options,this);
	}

	Name.prototype.getLabel=function(){
		if(this.label==''){
			return this.name;
		}
		return this.label;
	}

	/*
	The function adds a value element to the field
	@strValue:
	*/
	Field.prototype.addValue=function(strValue){
		this.values.push(strValue);
	}

	/*
	The function checks whether the field has any value	
	@return: True if values present,else false
	*/
	Field.prototype.hasValues=function(){		
		if(this.values.length==0){
			return false;
		}
		return true;
	}

	Field.prototype.numValues=function(){
		return this.value.length;
	}

	/*
	*/
	function SubHeading(options){
		this.headings=[];
		utility.config(options,this);
	}

	SubHeading.prototype.addHeading=function(value){
		this.headings.push(value);
	}

	return{
		RxtTemplate:RxtTemplate,
		Ui:Ui,
		Content:Content,
		List:List,
		Table:Table,
		Field:Field,
		Name:Name
	}
	
};
