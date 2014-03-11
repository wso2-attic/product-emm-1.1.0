var meta={
    use:'export',
    type:'formo',
    required:['model','template']
};

var module=function(){

    function getOverviewFields(template){

        var fields=[];

        for each(var table in template.tables){

            if(table.name.toLowerCase()=='overview'){

               for each(var field in table.fields){

                    var searchBool = (field.meta.search == "true");

                    var search=searchBool||false;

                    fields.push({'field_name':field.name,'field_label':field.label ,'search':search});



                }
            }
        }

        return fields;
    }
    return{
        execute:function(context){
            var model=context.model;
            var template=context.template;
            return getOverviewFields(template);
        }
    }
}