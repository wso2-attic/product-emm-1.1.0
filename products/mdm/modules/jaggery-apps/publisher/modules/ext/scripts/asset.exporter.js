var meta={
    use:'export',
    type:'asset.exporter',
    required:['model','template']
};

/*
Description: Converts the data to an asset format used by the ArtifactManager
Filename:asset.exporter.js
Created Dated: 11/8/2013
 */
var module=function(){

   var log=new Log();

   /*
   Converts all of the fields to an array of attributes
    */
   function getAttributes(model){

       var attributes={};
       var tableName='';
       var fieldName='';

       for each(var table in model.dataTables){

           if(table.name!='*') {

               //Store in the attributes array
               for each(var field in table.fields){
                    tableName=table.name;
                    fieldName=field.name;
                    attributes[tableName+'_'+fieldName]=field.value;
               }
           }
       }

       return attributes;
   }

   /*
   Creates an asset structure
    */
   function getAsset(model){

       var asset={};

       var idField=model.getField('*.id');

       if(idField){
           asset['id']=idField.value;
       }

       var nameField=model.getField('overview.name');

       if(nameField){
           asset['name']=nameField.value;
       }


      // asset['lifeCycle']=model.getField('*.lifeCycle').value;
      // asset['lifeCycleState']=model.getField('*.lifeCycleState').value;

       return asset;
   }

   return{
       execute:function(context){
           log.debug('Entered '+meta.type);

           var model=context.model;
           var template=context.template;

           var assetObject=getAsset(model);
           assetObject['attributes']=getAttributes(model);


           log.debug('Exited: '+meta.type);

           return assetObject;
       }
   }
};